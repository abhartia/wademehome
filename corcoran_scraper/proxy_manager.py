import random


class ProxyManager:
    def __init__(self, proxies: list[str]):
        if not proxies:
            raise ValueError("Proxy list cannot be empty.")
        self.proxies = proxies

    def get_random_proxy(self) -> str:
        return random.choice(self.proxies)

    def get_proxies_for_requests(self) -> dict[str, str]:
        proxy = self.get_random_proxy()
        return {"http": proxy, "https": proxy}
