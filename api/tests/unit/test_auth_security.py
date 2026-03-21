from auth.security import hash_password, hash_token, random_token, verify_password


def test_password_hash_roundtrip() -> None:
    password = "very-strong-password"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong-password", hashed) is False


def test_session_token_hash_is_stable() -> None:
    token = random_token()
    assert hash_token(token) == hash_token(token)
