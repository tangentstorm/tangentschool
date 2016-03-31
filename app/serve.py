# this is just a stub for the eventual python backend
import json

import eventlet
from eventlet import wsgi
import psycopg2


def db_connect():
    # (for now, just change to real username/ password that you set up )
    return psycopg2.connect(host="localhost", database="tangentschool",
                            user="tangentschool", password="tangentschool")


def get_cursor():
    dbc = db_connect()
    dbc.autocommit = True
    return dbc.cursor()


def list_courses():
    cur = get_cursor()
    cur.execute("SELECT name FROM course ORDER BY ID")
    return cur.fetchall()


def get_courses(env, start):
    """dummy wsgi resource to return a list of courses"""
    start('200 OK', [('Content-Type', 'application/json')])
    courses = list_courses()
    return json.dumps(
        {"courses":
            [{"name": c} for (c,) in courses]})


def get_steps(env, start):
    """get the steps for a particular lesson"""
    start('200 OK', [('Content-Type', 'application/json')])
    lesson_name = 'bits' # TODO: fetch from url
    cur = get_cursor()
    cur.execute(
        """
        SELECT s.id, s.op, (CASE s.op WHEN 4 THEN '' ELSE s.arg END) AS arg
        FROM lesson
        LEFT JOIN step s ON lesson.id=s.lid
        WHERE lesson.name = %(lesson)s
        ORDER BY s.seq;
        """, {"lesson": lesson_name})
    return json.dumps({'steps': [{'id': i, 'op': o, 'arg': a}
                                 for (i, o, a) in cur.fetchall()]})


def get_lessons(env, start):
    """generate a json graph of the syllabus for a course, in d3's format"""
    start('200 OK', [('Content-Type', 'application/json')])

    cid = 1  # TODO: fetch from url
    cur = get_cursor()
    cur.execute(
        """
        select id, name from lesson
        where id in (select x from prereq where cid=(%(cid)s)
               union select y from prereq where cid=(%(cid)s))
        """, {'cid': cid})

    nodes = []  # list of node objects
    idx = {}    # map node ids to indices in the array
    for (i, (nid, name)) in enumerate(cur.fetchall()):
        idx[nid] = i
        nodes.append({'n': name})

    cur.execute('select x, y from prereq where cid=1')
    edges = [{'source': idx[x], 'target': idx[y]} for (x, y) in cur.fetchall()]

    return json.dumps({'lessons': {"nodes": nodes, "edges": edges}})


def save_answer(uid, sid, answer):
    """store a record of the user's answer"""
    cur = get_cursor()
    cur.execute("""
        INSERT INTO user_answer (uid, sid, answer)
        VALUES (%(uid)s, %(sid)s, %(answer)s)
    """, {"uid":uid, "sid":sid, "answer":answer})

def check_answer(env, start):
    """check a user's answer when they post one"""
    if env['REQUEST_METHOD'] != 'POST':
        start('405 METHOD NOT ALLOWED', [])
        return "Use POST."
    else:
        uid = 1   # TODO: real user ids from session
        data = json.loads(env['wsgi.input'].read())
        # TODO: error handling/validation
        sid = data['stepId']
        answer = data['answer']

        # save a copy of each answer attempt, for analytics
        save_answer(uid, sid, answer)

        cur = get_cursor()
        cur.execute("SELECT op, arg FROM step WHERE id=%(sid)s", {"sid": sid})
        op, arg = cur.fetchone()
        assert op == 4  # CHK
        goal, pos, neg = arg.split("|")

        start('200 OK', [('Content-Type', 'application/json')])
        return json.dumps({
            "correct": answer == goal,
            "message": pos if answer == goal else neg})

url_map = [
    ("/check", check_answer),
    ("/courses", get_courses),
    ("/lessons", get_lessons),
    ("/steps", get_steps)]


def dispatch(env, start):
    path = env['PATH_INFO']
    for prefix, handler in url_map:
        if path.startswith(prefix):
            return handler(env, start)
    # no handler:
    start('404 Not Found', [('Content-Type', 'application/json')])
    return "{'error': 'not found'}"


if __name__ == '__main__':
    wsgi.server(eventlet.listen(('localhost', 5000)), dispatch)
