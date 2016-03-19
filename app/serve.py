# this is just a stub for the eventual python backend
import json

import eventlet
from eventlet import wsgi
import psycopg2


def db_connect():
    # (for now, just change to real username/ password that you set up )
    return psycopg2.connect(host="localhost", database="tangentschool",
                            user="tangentschool", password="tangentschool")


def list_courses():
    dbc = db_connect()
    cur = dbc.cursor()
    cur.execute("SELECT name FROM course ORDER BY ID")
    return cur.fetchall()


def get_courses(env, start):
    """dummy wsgi resource to return a list of courses"""
    start('200 OK', [('Content-Type', 'application/json')])
    courses = list_courses()
    return json.dumps(
        {"courses":
            [{"name": c} for (c,) in courses]})


if __name__ == '__main__':
    wsgi.server(eventlet.listen(('localhost', 5000)), get_courses)
