import configparser

CFG_PATH = "config.ini"

class CFGParser():
    """
    Basic parser class for the config file.
    """
    def __init__(self):
        self.cfg = configparser.ConfigParser()
        with open(CFG_PATH) as f:
            self.cfg.read_file(f)
        
    def get_path(self):
        """
        Returns the directory path for generated files.
        """
        return self.cfg["DEFAULT"]["Path"]

    def get_expire(self):
        """
        Returns the file expiry time (seconds).
        """
        return int(self.cfg["DEFAULT"]["FileExpiryInterval"])
    
    def get_delay(self):
        """
        Returns the daemon sleep delay (seconds).
        """
        return int(self.cfg["DEFAULT"]["DelayInterval"])

    def get_steps(self):
        """
        Returns the default number of interpolation steps.
        """
        return int(self.cfg["API"]["StepsAmount"])
    
    def get_amount(self):
        """
        Returns the default bulk file amount.
        """
        return int(self.cfg["API"]["BulkAmount"])