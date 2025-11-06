from django.http import JsonResponse
from .boggle_solver import Boggle
from .randomGen import random_grid
from .readJSONFile import read_json_to_list


def create_game(request, size):
    """
    Create a new Boggle game of a given size, generate a random grid,
    solve it, and return both the grid and solutions as JSON.
    """
    # 1️⃣ Generate a random grid
    grid = random_grid(size)

    # 2️⃣ Load dictionary (ensure this file exists in your project root)
    dictionary = read_json_to_list("./full-wordlist.json")

    # 3️⃣ Create and solve the Boggle game
    game = Boggle(grid, dictionary)
    solutions = game.getSolution()

    # 4️⃣ Return JSON response
    return JsonResponse({
        "grid": grid,
        "solutions": solutions
    })
