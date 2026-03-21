import random

class ProxyManager:
    def __init__(self, proxies):
        """
        Initialize ProxyManager with a list of proxy URLs.

        Args:
            proxies (list): List of proxy URLs (e.g., 'http://ip:port')
        """
        if not proxies:
            raise ValueError("Proxy list cannot be empty.")
        self.proxies = proxies

    def get_random_proxy(self):
        """
        Returns a random proxy URL from the list.
        """
        return random.choice(self.proxies)

    def get_proxies_for_requests(self):
        """
        Returns a proxy dictionary formatted for the 'requests' library.
        """
        proxy = self.get_random_proxy()
        return {
            "http": proxy,
            "https": proxy,
        }

    def get_proxy_for_playwright(self):
        """
        Returns a proxy dictionary formatted for Playwright browser launch.
        """
        proxy = self.get_random_proxy()
        return {
            "server": proxy,
        }