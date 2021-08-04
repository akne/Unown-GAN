import threading
import time
import os

from cfg_parser import CFGParser

class Daemon():
    """
    Basic background service that checks for directory structure
    and routinely frees up space by removing old files.
    """
    def __init__(self):
        self.check_setup()
        self.start()

    def check_setup(self):
        """
        Checks the directory structure and fixes it if it doesn't 
        match the config file.
        """
        path = CFGParser().get_path()
        if not os.path.exists(path):
            os.mkdir(path)
            os.mkdir("{0}/img".format(path))

    def clean_old(self):
        """
        Clears all generated files if they are older than the
        interval specified in the config file.
        """
        cfg = CFGParser()
        path = cfg.get_path()
        expire = cfg.get_expire()
        cur_time = time.time()

        files = []
        for dir, _, file in os.walk(path):
            files += [os.path.join(dir, f) for f in file]
        for f in files:
            if os.stat(f).st_mtime < cur_time - expire:
                if os.path.isfile(f):
                    os.remove(f)

    def start(self):
        """
        Starts up a thread to routintely delete files.
        """
        t = threading.Thread(target=self._start)
        t.daemon = True
        t.start()

    def _start(self):
        """
        Infinite loop that clears generated files and sleeps.
        """
        while(True):
            self.clean_old()
            time.sleep(CFGParser().get_delay())
        