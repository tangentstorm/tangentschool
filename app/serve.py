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


url_map = [
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
