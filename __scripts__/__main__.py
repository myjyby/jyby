from json import loads
# from sys import path as syspath, argv
from os import makedirs, listdir
from os.path import join, exists, dirname, splitext
from shutil import copyfile
from re import sub

def makeSafe (path):
  return sub(r'[^a-z0-9]', '_', path.lower())

def run ():
  """
  Get the data
  """
  this_dir = dirname(__file__)
  root = join(this_dir, "../")
  pages_dir = join(root, "pages/")
  if not exists(pages_dir):
    makedirs(pages_dir)
  
  for k in listdir(join(root, "public/data/")):
    category_page = splitext(k)[0]
    page_dir = join(pages_dir, category_page.lower())
    if not exists(page_dir):
      makedirs(page_dir)
    copyfile(join(pages_dir, "__template__.html"), join(page_dir, "index.html"))

    data = loads(open(join(root, "public/data/", k)).read())
    for d in data:
      if d["title"] is not None:
        content_page = makeSafe(d["title"])
        content_page_dir = join(page_dir, content_page.lower())
        if not exists(content_page_dir):
          makedirs(content_page_dir)
        copyfile(join(pages_dir, "__template__.html"), join(content_page_dir, "index.html"))

if __name__ == "__main__":
  run()