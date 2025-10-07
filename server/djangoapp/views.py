# Uncomment the required imports before adding the code

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponse
# from django.contrib.auth.models import User
# from django.shortcuts import get_object_or_404, render, redirect
# from django.contrib.auth import logout
# from django.contrib import messages
# from datetime import datetime
from django.shortcuts import render
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from .models import CarMake, CarModel
from django.http import JsonResponse
import logging
import json
from django.views.decorators.csrf import csrf_exempt
# from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request

@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    else:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({"userName": "", "status": "Logged out"})

@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})
    
    user = User.objects.create_user(username=username, first_name=first_name,
                                    last_name=last_name, password=password, email=email)
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})

@csrf_exempt  # Se fores aceder via fetch do frontend sem CSRF token
def get_cars(request):
    # Conta quantos CarMake existem na base de dados
    count = CarMake.objects.count()
    print(f"Total Car Makes: {count}")
    
    # Se não houver nenhum, poderias popular com dados iniciais
    # Assumindo que tens uma função `initiate()` para isso
    if count == 0:
        try:
            from .populate import initiate
            initiate()
        except ImportError:
            print("Função initiate() não encontrada")

    # Seleciona todos os CarModels, incluindo o CarMake relacionado
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })

    # Retorna os dados em formato JSON
    return JsonResponse({"CarModels": cars})

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...
