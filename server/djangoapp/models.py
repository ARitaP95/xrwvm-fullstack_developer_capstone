from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    country = models.CharField(max_length=50, blank=True)  # Exemplo de campo extra opcional

    def __str__(self):
        return self.name  # Representação legível do CarMake

class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')  # Many-to-One relationship
    dealer_id = models.IntegerField(null=True, blank=True)# ID do dealer (Cloudant)
    name = models.CharField(max_length=100)
    
    # Tipo do carro com escolhas limitadas
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    
    # Ano com validadores
    year = models.IntegerField(
        default=2023,
        validators=[
            MaxValueValidator(2023),
            MinValueValidator(2015)
        ]
    )

    # Campos opcionais adicionais
    color = models.CharField(max_length=30, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        # Representação legível: marca + modelo + tipo + ano
        return f"{self.car_make.name} {self.name} ({self.type}, {self.year})"
