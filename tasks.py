import logging
import time
import sys
from time import sleep

# from bnorg import config
# from bnorg.helpers import ui
from invoke import task
from plumbum import local
from os import system

TEST_REGEX = "simple parse"
ANDROID_SDK_PATH = "/home/keenan/Android/Sdk"

@task
def install(ctx):
    system('yarn install')
    system('yarn link org-mode-connection')

@task
def x(ctx):
    ctx.run(f'adb')

@task
def a(ctx):
    system('react-native run-android')

@task
def s(ctx):
    kill_server(ctx)
    bridge(ctx)
    system('yarn start')

@task
def run_storybook(ctx):
    ui.open_in_terminal('yarn run storybook')
    system('chromium http://localhost:7007')

@task
def gc(ctx, name):
    ctx.run(f'ignite projectcomponents functional-component {name}')


@task
def gr(ctx, name):
    ctx.run(f'ignite projectcomponents redux {name}')


@task
def gt(ctx, name):
    ctx.run(f'ignite projectcomponents functional-container {name}')


@task
def bridge(ctx):
    ctx.run(f'{ANDROID_SDK_PATH}/platform-tools/adb reverse tcp:8081 tcp:8081')


@task
def reload(ctx):
    ctx.run(f'{ANDROID_SDK_PATH}/platform-tools/adb shell input text "RR"')


@task
def add(ctx, app):
    ctx.run(f'yarn add {app}')
    ctx.run(f'react-native link {app}')


@task
def kill_server(ctx):
    ctx.run('fuser -k -n tcp 8081')


@task
def tron(ctx):
    system('~/devSpace/tools/Reactotron/Reactotron &')


# @task
# def a(ctx):
#     ui.open_in_terminal('react-native run-android')


@task
def t(ctx):
    system(f'./node_modules/.bin/jest -b --watch --notify')


@task
def reset_db(ctx):
    files = ["default.realm", "default.realm.lock"]
    for file in files:
        (local.cwd / file).delete()
    ui.send_message_to_user('Removed Realm database.')
