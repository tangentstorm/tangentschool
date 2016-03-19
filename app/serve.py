# this is just a stub for the eventual python backend

import eventlet
from eventlet import wsgi
import json


def get_courses(env, start):
    """dummy wsgi resource to return a list of courses"""
    start('200 OK', [('Content-Type', 'application/json')])
    return json.dumps(["course A", "course B", "course C"])


if __name__ == '__main__':
    wsgi.server(eventlet.listen(('localhost', 5000)), get_courses)
