import sys
from os.path import join
from os import _exit
from typing import Dict
from yaml import load, dump
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

def dockerComposeFile(dir: str='.', mode: str='r'):
  f = join(dir, 'docker-compose.yml')
  try:
      return open(f, mode)
  except IOError as error:
      print(error)
      _exit(1)

def main(icm, ssrimage, nginximage):
  data: Dict = load(dockerComposeFile(), Loader=Loader)
  data['services']['pwa'].pop('build')
  data['services']['nginx'].pop('build')
  data['services']['pwa'].update({'image': ssrimage})
  data['services']['pwa']['environment']['ICM_BASE_URL'] = icm
  data['services']['nginx'].update({'image': nginximage})
  data['services']['nginx']['environment']['CACHE'] = 1
  dump(data, dockerComposeFile('./dist','w'), Dumper=Dumper)

if __name__ == "__main__":
  if len(sys.argv) != 4:
      print("Usage: python docker-compose.py <icm> <ssrimage> <nginximage>")
      _exit(1)
  icm = sys.argv[1]
  ssrimage = sys.argv[2]
  nginximage = sys.argv[3]
  main(icm, ssrimage, nginximage)
