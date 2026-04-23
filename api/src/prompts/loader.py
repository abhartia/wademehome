import os


def load_app_prompt(relative_path):
    """
    Loads a markdown prompt file relative to the location of loader.py.

    Args:
        relative_path (str): Path to the markdown file, relative to the prompts directory.

    Returns:
        str: Contents of the markdown file.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    prompts_dir = base_dir  # Assuming loader.py is in the prompts directory

    # Resolve the absolute path
    abs_path = os.path.abspath(os.path.join(prompts_dir, relative_path))

    # Ensure the resolved path is within the prompts directory
    if not abs_path.startswith(prompts_dir):
        raise ValueError("Invalid path: Access outside the prompts directory is not allowed.")

    with open(abs_path + ".md") as f:
        return f.read()
