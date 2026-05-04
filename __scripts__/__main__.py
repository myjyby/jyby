from json import loads
from sys import argv
from os import makedirs, listdir
from os.path import join, exists, dirname, splitext, relpath
from shutil import copyfile
from re import sub
from pathlib import Path

def makeSafe (path):
  return sub(r'[^a-z0-9]', '_', path.lower())

# def reconstructPath (string):
#   path = sub(r"[\{\}]+", "", string)
#   return join("/jyby/", path[1:])

# def resolveAbsPaths (file):
#   html = ""
#   # print(root)
#   for line in file:
#     line = sub(r"{{[^}]*}}", lambda x: reconstructPath(x.group()), line)
#     html += line
#   return html

def setBasepath(html, basepath):
  html = sub(r"{{[^}]*}}", lambda x: basepath, html)
  return html

def run (basepath):
  """
  Get the data
  """
  this_dir = dirname(__file__)
  root = join(this_dir, "../")

  pages_dir = join(root, "pages/")
  if not exists(pages_dir):
    makedirs(pages_dir)

  template = setBasepath(open(join(root, "__template__.html"), 'r', encoding='utf-8').read(), basepath)

  ## Resolve the relative paths for the home page
  with open(join(root, "index.html"), 'w') as outfile:
    # html = setBasepath(template, basepath)
    outfile.write(template)
  
  for k in listdir(join(root, "public/data/")):
    category_page = splitext(k)[0]
    page_dir = join(pages_dir, category_page.lower())
    if not exists(page_dir):
      makedirs(page_dir)

    ## Resolve the relative paths
    with open(join(page_dir, "index.html"), 'w') as outfile:
      # html = setBasepath(template, basepath)
      outfile.write(template)
    # copyfile(join(pages_dir, "__template__.html"), join(page_dir, "index.html"))

    data = loads(open(join(root, "public/data/", k)).read())
    for d in data:
      if d["title"] is not None:
        content_page = makeSafe(d["title"])
        content_page_dir = join(page_dir, content_page.lower())
        if not exists(content_page_dir):
          makedirs(content_page_dir)

        ## Resolve the relative paths
        with open(join(content_page_dir, "index.html"), 'w') as outfile:
          # html = setBasepath(template, basepath)
          outfile.write(template)
        # copyfile(join(pages_dir, "__template__.html"), join(content_page_dir, "index.html"))

if __name__ == "__main__":
  basepath = "http://localhost:8888/"
  try:
    basepath = argv[1]
  except:
    pass
  run(basepath)