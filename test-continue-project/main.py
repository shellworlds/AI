#!/usr/bin/env python3
"""Simple greeting CLI

Usage examples:
  python main.py Alice
  python main.py --shout --repeat 3 Bob
"""

from argparse import ArgumentParser


def greet(name: str, shout: bool = False) -> str:
    """Return a greeting for `name`. If `shout` is True, returns uppercased greeting."""
    message = f"Hello, {name}!"
    return message.upper() if shout else message


def parse_args() -> ArgumentParser:
    parser = ArgumentParser(description="Greet someone from the command line")
    parser.add_argument("name", nargs="?", default="World", help="Name to greet")
    parser.add_argument("-s", "--shout", action="store_true", help="Uppercase the greeting")
    parser.add_argument("-r", "--repeat", type=int, default=1, help="How many times to repeat the greeting")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    for _ in range(max(0, args.repeat)):
        print(greet(args.name, args.shout))


if __name__ == "__main__":
    main()
