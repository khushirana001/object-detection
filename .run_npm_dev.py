import os
import subprocess
cwd = r'D:\object detection\object-detection-app\frontend\public'
env = os.environ.copy()
env['PATH'] = r'C:\Program Files\nodejs;' + env.get('PATH', '')
subprocess.run([r'C:\Program Files\nodejs\npm.cmd', 'run', 'dev', '--', '--host', '0.0.0.0'], cwd=cwd, env=env)
