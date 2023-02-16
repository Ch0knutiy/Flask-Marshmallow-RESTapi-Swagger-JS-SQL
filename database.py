# database.py
from marshmallow import EXCLUDE
from sqlalchemy.sql.expression import func
from flask import abort, make_response
from datetime import datetime
from config import db
from models import City, CitySchema, Flights, FlightsSchema
from models import Country, CountrySchema, Hotel, HotelSchema
from models import Transfer, TransferSchema
from models import Route, RouteSchema, Ticket, TicketSchema
from models import Client, ClientSchema, Company, CompanySchema
from models import Employee, EmployeeSchema


# ░█████╗░██╗████████╗██╗░░░██╗
# ██╔══██╗██║╚══██╔══╝╚██╗░██╔╝
# ██║░░╚═╝██║░░░██║░░░░╚████╔╝░
# ██║░░██╗██║░░░██║░░░░░╚██╔╝░░
# ╚█████╔╝██║░░░██║░░░░░░██║░░░
# ░╚════╝░╚═╝░░░╚═╝░░░░░░╚═╝░░░

def read_all_cities():
    cities = City.query.all()
    cities_schema = CitySchema(many=True)
    return cities_schema.dump(cities)


def read_one_city(city_id):
    city = City.query.filter(City.city_id == city_id).one_or_none()

    if city is not None:
        city_schema = CitySchema()
        return city_schema.dump(city)
    else:
        abort(
            404, f"City with id {city_id} not found"
        )

def create_city(city):
    city_id = city.get("city_id")

    city2 = {
      "city_country": city.get("city_country"),
      "city_id": db.session.query(func.max(City.city_id)).scalar() + 1,
      "city_name": city.get("city_name")
    }
    city_schema = CitySchema()
    new_city = city_schema.load(city2, session=db.session)
    db.session.add(new_city)
    db.session.commit()
    return city_schema.dump(new_city), 201

def update_city(city):
    city_id = city.get("city_id")
    existing_city = City.query.filter(City.city_id == city_id).one_or_none()

    if existing_city:
        city_schema = CitySchema()
        update_city = city_schema.load(city, session=db.session)
        existing_city.city_name = update_city.city_name
        existing_city.city_country = update_city.city_country
        db.session.merge(existing_city)
        db.session.commit()
        return city_schema.dump(existing_city), 201
    else:
        abort(
            404,
            f"City with id {city_id} not found" 
        )

def delete_city(city_id):
    existing_city = City.query.filter(City.city_id == city_id).one_or_none()

    if existing_city:
        db.session.delete(existing_city)
        db.session.commit()
        return make_response(f"City with id {city_id} successfully deleted", 200)
    else:
        abort(
            404,
            f"City with id {city_id} not found"
        )
        
# ░█████╗░░█████╗░██╗░░░██╗███╗░░██╗██████╗░██╗░░░██╗
# ██╔══██╗██╔══██╗██║░░░██║████╗░██║██╔══██╗╚██╗░██╔╝
# ██║░░╚═╝██║░░██║██║░░░██║██╔██╗██║██████╔╝░╚████╔╝░
# ██║░░██╗██║░░██║██║░░░██║██║╚████║██╔══██╗░░╚██╔╝░░
# ╚█████╔╝╚█████╔╝╚██████╔╝██║░╚███║██║░░██║░░░██║░░░
# ░╚════╝░░╚════╝░░╚═════╝░╚═╝░░╚══╝╚═╝░░╚═╝░░░╚═╝░░░        
        
def read_all_countries():
    countries = Country.query.all()
    countries_schema = CountrySchema(many=True)
    return countries_schema.dump(countries)

def read_one_country(id):
    country = Country.query.filter(Country.id == id).one_or_none()

    if country is not None:
        country_schema = CountrySchema()
        return country_schema.dump(country)
    else:
        abort(
            404, f"Country with id {id} not found"
        )
def create_country(country):

    country2 = {
        "id": db.session.query(func.max(Country.id)).scalar() + 1,
        "country": country.get("country")
    }
    country_schema = CountrySchema()
    new_country = country_schema.load(country2, session=db.session)
    db.session.add(new_country)
    db.session.commit()
    return country_schema.dump(new_country), 201

def update_country(country):
    id = country.get("id")
    existing_country = Country.query.filter(Country.id == id).one_or_none()

    if existing_country:
        country_schema = CountrySchema()
        update_country = country_schema.load(country, session=db.session)
        existing_country.country = update_country.country
        db.session.merge(existing_country)
        db.session.commit()
        return country_schema.dump(existing_country), 201
    else:
        abort(
            404,
            f"Country with id {id} not found" 
        )

def delete_country(id):
    existing_country = Country.query.filter(Country.id == id).one_or_none()

    if existing_country:
        db.session.delete(existing_country)
        db.session.commit()
        return make_response(f"Country with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Country with id {id} not found"
        )
        

# ░█████╗░██╗░░░░░██╗███████╗███╗░░██╗████████╗
# ██╔══██╗██║░░░░░██║██╔════╝████╗░██║╚══██╔══╝
# ██║░░╚═╝██║░░░░░██║█████╗░░██╔██╗██║░░░██║░░░
# ██║░░██╗██║░░░░░██║██╔══╝░░██║╚████║░░░██║░░░
# ╚█████╔╝███████╗██║███████╗██║░╚███║░░░██║░░░
# ░╚════╝░╚══════╝╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░

def read_all_clients():
    clients = Client.query.all()
    clients_schema = ClientSchema(many=True)
    return clients_schema.dump(clients)

def read_one_client(id):
    client = Client.query.filter(Client.id == id).one_or_none()

    if client is not None:
        client_schema = ClientSchema()
        return client_schema.dump(client)
    else:
        abort(
            404, f"Client with id {id} not found"
        )
        
def create_client(client):
    id = client.get("id")

    client2 = {
      "id": db.session.query(func.max(Client.id)).scalar() + 1,
      "surname": client.get("surname"),
      "name": client.get("name"),
      "patronymic": client.get("patronymic"),
      "phone": client.get("phone"),
      "date_of_buy": client.get("date_of_buy"),
      "time_of_buy": client.get("time_of_buy"),
      "route_id": client.get("route_id")
    }
    client_schema = ClientSchema()
    new_client = client_schema.load(client2, session=db.session)
    db.session.add(new_client)
    db.session.commit()
    return client_schema.dump(new_client), 201

def update_client(client):
    id = client.get("id")
    existing_client = Client.query.filter(Client.id == id).one_or_none()

    if existing_client:
        client_schema = ClientSchema()
        update_client = client_schema.load(client, session=db.session)
        existing_client.surname = update_client.surname
        existing_client.name = update_client.name
        existing_client.patronymic = update_client.patronymic
        existing_client.phone = update_client.phone
        existing_client.date_of_buy = update_client.date_of_buy
        existing_client.time_of_buy = update_client.time_of_buy
        existing_client.route_id = update_client.route_id
        db.session.merge(existing_client)
        db.session.commit()
        return client_schema.dump(existing_client), 201
    else:
        abort(
            404,
            f"Client with id {id} not found" 
        )

def delete_client(id):
    existing_client = Client.query.filter(Client.id == id).one_or_none()

    if existing_client:
        db.session.delete(existing_client)
        db.session.commit()
        return make_response(f"Client with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Client with id {id} not found"
        )
        

# ░█████╗░░█████╗░███╗░░░███╗██████╗░░█████╗░███╗░░██╗██╗░░░██╗
# ██╔══██╗██╔══██╗████╗░████║██╔══██╗██╔══██╗████╗░██║╚██╗░██╔╝
# ██║░░╚═╝██║░░██║██╔████╔██║██████╔╝███████║██╔██╗██║░╚████╔╝░
# ██║░░██╗██║░░██║██║╚██╔╝██║██╔═══╝░██╔══██║██║╚████║░░╚██╔╝░░
# ╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░░░░░██║░░██║██║░╚███║░░░██║░░░
# ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝░░╚═╝╚═╝░░╚══╝░░░╚═╝░░░
def read_all_companies():
    companies = Company.query.all()
    companies_schema = CompanySchema(many=True)
    return companies_schema.dump(companies)

def read_one_company(id):
    company = Company.query.filter(Company.id == id).one_or_none()

    if company is not None:
        company_schema = CompanySchema()
        return company_schema.dump(company)
    else:
        abort(
            404, f"Company with id {id} not found"
        )
        
def create_company(company):
    id = company.get("id")

    company2 = {
      "id": db.session.query(func.max(Company.id)).scalar() + 1,
      "name": company.get("name"),
      "flights_num": company.get("flights_num")
    }
    company_schema = CompanySchema()
    new_company = company_schema.load(company2, session=db.session)
    db.session.add(new_company)
    db.session.commit()
    return company_schema.dump(new_company), 201

def update_company(company):
    id = company.get("id")
    existing_company = Company.query.filter(Company.id == id).one_or_none()

    if existing_company:
        company_schema = CompanySchema()
        update_company = company_schema.load(company, session=db.session)
        existing_company.name = update_company.name
        existing_company.flights_num = update_company.flights_num
        db.session.merge(existing_company)
        db.session.commit()
        return company_schema.dump(existing_company), 201
    else:
        abort(
            404,
            f"Company with id {id} not found" 
        )

def delete_company(id):
    existing_company = Company.query.filter(Company.id == id).one_or_none()

    if existing_company:
        db.session.delete(existing_company)
        db.session.commit()
        return make_response(f"Company with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Company with id {id} not found"
        )

# ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗░██████╗
# ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝██╔════╝
# █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░╚█████╗░
# ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░░╚═══██╗
# ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗██████╔╝
# ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝╚═════╝░


def read_all_employees():
    employees = Employee.query.all()
    employees_schema = EmployeeSchema(many=True)
    return employees_schema.dump(employees)

def read_one_employee(id):
    employee = Employee.query.filter(Employee.id == id).one_or_none()

    if employee is not None:
        employee_schema = EmployeeSchema()
        return employee_schema.dump(employee)
    else:
        abort(
            404, f"Employee with id {id} not found"
        )
        
def create_employee(employee):
    id = employee.get("id")

    employee2 = {
      "id": db.session.query(func.max(Employee.id)).scalar() + 1,
      "surname": employee.get("surname"),
      "name": employee.get("name"),
      "patronymic": employee.get("patronymic"),
      "address": employee.get("address"),
      "birth": employee.get("birth"),
      "post": employee.get("post"),
      "salary": employee.get("salary"),
      "transfer_id": employee.get("transfer_id"),
      "phone": employee.get("phone")
    }
    employee_schema = EmployeeSchema()
    new_employee = employee_schema.load(employee2, session=db.session)
    db.session.add(new_employee)
    db.session.commit()
    return employee_schema.dump(new_employee), 201

def update_employee(employee):
    id = employee.get("id")
    existing_employee = Employee.query.filter(Employee.id == id).one_or_none()

    if existing_employee:
        employee_schema = EmployeeSchema()
        update_employee = employee_schema.load(employee, session=db.session)
        existing_employee.surname = update_employee.surname
        existing_employee.name = update_employee.name
        existing_employee.patronymic = update_employee.patronymic
        existing_employee.address = update_employee.address
        existing_employee.birth = update_employee.birth
        existing_employee.post = update_employee.post
        existing_employee.salary = update_employee.salary
        existing_employee.transfer_id = update_employee.transfer_id
        existing_employee.phone = update_employee.phone
        db.session.merge(existing_employee)
        db.session.commit()
        return employee_schema.dump(existing_employee), 201
    else:
        abort(
            404,
            f"Employee with id {id} not found" 
        )

def delete_employee(id):
    existing_employee = Employee.query.filter(Employee.id == id).one_or_none()

    if existing_employee:
        db.session.delete(existing_employee)
        db.session.commit()
        return make_response(f"Employee with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Employee with id {id} not found"
        )


# ███████╗██╗░░░░░██╗░██████╗░██╗░░██╗████████╗░██████╗
# ██╔════╝██║░░░░░██║██╔════╝░██║░░██║╚══██╔══╝██╔════╝
# █████╗░░██║░░░░░██║██║░░██╗░███████║░░░██║░░░╚█████╗░
# ██╔══╝░░██║░░░░░██║██║░░╚██╗██╔══██║░░░██║░░░░╚═══██╗
# ██║░░░░░███████╗██║╚██████╔╝██║░░██║░░░██║░░░██████╔╝
# ╚═╝░░░░░╚══════╝╚═╝░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═════╝░

def read_all_flights():
    flights = Flights.query.all()
    flights_schema = FlightsSchema(many=True)
    return flights_schema.dump(flights)

def read_one_flights(num):
    flights = Flights.query.filter(Flights.num == num).one_or_none()

    if flights is not None:
        flights_schema = FlightsSchema()
        return flights_schema.dump(flights)
    else:
        abort(
            404, f"Flights with num {num} not found"
        )
        
def create_flights(flights):
    num = flights.get("num")

    flights2 = {
      "num": flights.get("num"),
      "date": flights.get("date"),
      "time": flights.get("time"),
      "aircraft": flights.get("aircraft"),
      "clazz": flights.get("clazz"),
      "free": flights.get("free")
    }
    flights_schema = FlightsSchema()
    new_flights = flights_schema.load(flights2, session=db.session)
    db.session.add(new_flights)
    db.session.commit()
    return flights_schema.dump(new_flights), 201

def update_flights(flights):
    num = flights.get("num")
    existing_flights = Flights.query.filter(Flights.num == num).one_or_none()

    if existing_flights:
        flights_schema = FlightsSchema()
        update_flights = flights_schema.load(flights, session=db.session)
        existing_flights.num = update_flights.num
        existing_flights.date = update_flights.date
        existing_flights.time = update_flights.time
        existing_flights.aircraft = update_flights.aircraft
        existing_flights.clazz = update_flights.clazz
        existing_flights.free = update_flights.free
        db.session.merge(existing_flights)
        db.session.commit()
        return flights_schema.dump(existing_flights), 201
    else:
        abort(
            404,
            f"Flights with v {num} not found" 
        )

def delete_flights(num):
    existing_flights = Flights.query.filter(Flights.num == num).one_or_none()

    if existing_flights:
        db.session.delete(existing_flights)
        db.session.commit()
        return make_response(f"Fights with id {num} successfully deleted", 200)
    else:
        abort(
            404,
            f"Flights with num {num} not found"
        )


# ██╗░░██╗░█████╗░████████╗███████╗██╗░░░░░░██████╗
# ██║░░██║██╔══██╗╚══██╔══╝██╔════╝██║░░░░░██╔════╝
# ███████║██║░░██║░░░██║░░░█████╗░░██║░░░░░╚█████╗░
# ██╔══██║██║░░██║░░░██║░░░██╔══╝░░██║░░░░░░╚═══██╗
# ██║░░██║╚█████╔╝░░░██║░░░███████╗███████╗██████╔╝
# ╚═╝░░╚═╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝╚═════╝░


def read_all_hotels():
    hotels = Hotel.query.all()
    hotels_schema = HotelSchema(many=True)
    return hotels_schema.dump(hotels)

def read_one_hotel(id):
    hotel = Hotel.query.filter(Hotel.id == id).one_or_none()

    if hotel is not None:
        hotel_schema = HotelSchema()
        return hotel_schema.dump(hotel)
    else:
        abort(
            404, f"Hotel with id {id} not found"
        )
        
def create_hotel(hotel):
    id = hotel.get("id")

    hotel2 = {
      "id": db.session.query(func.max(Hotel.id)).scalar() + 1,
      "name": hotel.get("name"),
      "clazz": hotel.get("clazz"),
      "categories": hotel.get("categories")
    }
    hotel_schema = HotelSchema()
    new_hotel = hotel_schema.load(hotel2, session=db.session)
    db.session.add(new_hotel)
    db.session.commit()
    return hotel_schema.dump(new_hotel), 201

def update_hotel(hotel):
    id = hotel.get("id")
    existing_hotel = Hotel.query.filter(Hotel.id == id).one_or_none()

    if existing_hotel:
        hotel_schema = HotelSchema()
        update_hotel = hotel_schema.load(hotel, session=db.session)
        existing_hotel.name = update_hotel.name
        existing_hotel.clazz = update_hotel.clazz
        existing_hotel.categories = update_hotel.categories
        db.session.merge(existing_hotel)
        db.session.commit()
        return hotel_schema.dump(existing_hotel), 201
    else:
        abort(
            404,
            f"Hotel with id {id} not found" 
        )

def delete_hotel(id):
    existing_hotel = Hotel.query.filter(Hotel.id == id).one_or_none()

    if existing_hotel:
        db.session.delete(existing_hotel)
        db.session.commit()
        return make_response(f"Hotel with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Hotel with id {id} not found"
        )
        

# ██████╗░░█████╗░██╗░░░██╗████████╗███████╗░██████╗
# ██╔══██╗██╔══██╗██║░░░██║╚══██╔══╝██╔════╝██╔════╝
# ██████╔╝██║░░██║██║░░░██║░░░██║░░░█████╗░░╚█████╗░
# ██╔══██╗██║░░██║██║░░░██║░░░██║░░░██╔══╝░░░╚═══██╗
# ██║░░██║╚█████╔╝╚██████╔╝░░░██║░░░███████╗██████╔╝
# ╚═╝░░╚═╝░╚════╝░░╚═════╝░░░░╚═╝░░░╚══════╝╚═════╝░

def read_all_routes():
    routes = Route.query.all()
    routes_schema = RouteSchema(many=True)
    return routes_schema.dump(routes)

def read_one_route(id):
    route = Route.query.filter(Route.id == id).one_or_none()

    if route is not None:
        route_schema = RouteSchema()
        return route_schema.dump(route)
    else:
        abort(
            404, f"Route with id {id} not found"
        )
        
def create_route(route):
    id = route.get("id")

    route2 = {
      "id": db.session.query(func.max(Route.id)).scalar() + 1,
      "name": route.get("name"),
      "city_id": route.get("city_id"),
      "duration": route.get("duration"),
      "hotel_id": route.get("hotel_id"),
      "company_id": route.get("company_id"),
      "employee_id": route.get("employee_id")
    }
    route_schema = RouteSchema()
    new_route = route_schema.load(route2, session=db.session)
    db.session.add(new_route)
    db.session.commit()
    return route_schema.dump(new_route), 201

def update_route(route):
    id = route.get("id")
    existing_route = Route.query.filter(Route.id == id).one_or_none()

    if existing_route:
        route_schema = RouteSchema()
        update_route = route_schema.load(route, session=db.session)
        existing_route.name = update_route.name
        existing_route.city_id = update_route.city_id
        existing_route.duration = update_route.duration
        existing_route.hotel_id = update_route.hotel_id
        existing_route.company_id = update_route.company_id
        existing_route.employee_id = update_route.employee_id
        db.session.merge(existing_route)
        db.session.commit()
        return route_schema.dump(existing_route), 201
    else:
        abort(
            404,
            f"Route with id {id} not found" 
        )

def delete_route(id):
    existing_route = Route.query.filter(Route.id == id).one_or_none()

    if existing_route:
        db.session.delete(existing_route)
        db.session.commit()
        return make_response(f"Route with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Route with id {id} not found"
        )
        
        
# ████████╗██╗░█████╗░██╗░░██╗███████╗████████╗░██████╗
# ╚══██╔══╝██║██╔══██╗██║░██╔╝██╔════╝╚══██╔══╝██╔════╝
# ░░░██║░░░██║██║░░╚═╝█████═╝░█████╗░░░░░██║░░░╚█████╗░
# ░░░██║░░░██║██║░░██╗██╔═██╗░██╔══╝░░░░░██║░░░░╚═══██╗
# ░░░██║░░░██║╚█████╔╝██║░╚██╗███████╗░░░██║░░░██████╔╝
# ░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝░░░╚═╝░░░╚═════╝░


def read_all_tickets():
    tickets = Ticket.query.all()
    tickets_schema = TicketSchema(many=True)
    return tickets_schema.dump(tickets)

def read_one_ticket(id):
    ticket = Ticket.query.filter(Ticket.id == id).one_or_none()

    if ticket is not None:
        ticket_schema = TicketSchema()
        return ticket_schema.dump(ticket)
    else:
        abort(
            404, f"Ticket with id {id} not found"
        )
        
def create_ticket(ticket):
    id = ticket.get("id")

    ticket2 = {
      "id": db.session.query(func.max(Ticket.id)).scalar() + 1,
      "flight_num": ticket.get("flight_num"),
      "seat": ticket.get("seat"),
      "id_client": ticket.get("id_client")
    }
    ticket_schema = TicketSchema()
    new_ticket = ticket_schema.load(ticket2, session=db.session)
    db.session.add(new_ticket)
    db.session.commit()
    return ticket_schema.dump(new_ticket), 201

def update_ticket(ticket):
    id = ticket.get("id")
    existing_ticket = Ticket.query.filter(Ticket.id == id).one_or_none()

    if existing_ticket:
        ticket_schema = TicketSchema()
        update_ticket = ticket_schema.load(ticket, session=db.session)
        existing_ticket.flight_num = update_ticket.flight_num
        existing_ticket.seat = update_ticket.seat
        existing_ticket.id_client = update_ticket.id_client
        db.session.merge(existing_ticket)
        db.session.commit()
        return ticket_schema.dump(existing_ticket), 201
    else:
        abort(
            404,
            f"Ticket with id {id} not found" 
        )

def delete_ticket(id):
    existing_ticket = Ticket.query.filter(Ticket.id == id).one_or_none()

    if existing_ticket:
        db.session.delete(existing_ticket)
        db.session.commit()
        return make_response(f"Ticket with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Ticket with id {id} not found"
        )
        
        
# ████████╗██████╗░░█████╗░███╗░░██╗░██████╗███████╗███████╗██████╗░░██████╗
# ╚══██╔══╝██╔══██╗██╔══██╗████╗░██║██╔════╝██╔════╝██╔════╝██╔══██╗██╔════╝
# ░░░██║░░░██████╔╝███████║██╔██╗██║╚█████╗░█████╗░░█████╗░░██████╔╝╚█████╗░
# ░░░██║░░░██╔══██╗██╔══██║██║╚████║░╚═══██╗██╔══╝░░██╔══╝░░██╔══██╗░╚═══██╗
# ░░░██║░░░██║░░██║██║░░██║██║░╚███║██████╔╝██║░░░░░███████╗██║░░██║██████╔╝
# ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚═╝░░░░░╚══════╝╚═╝░░╚═╝╚═════╝░


def read_all_transfers():
    transfers = Transfer.query.all()
    transfers_schema = TransferSchema(many=True)
    return transfers_schema.dump(transfers)

def read_one_transfer(id):
    transfer = Transfer.query.filter(Transfer.id == id).one_or_none()

    if transfer is not None:
        transfer_schema = TransferSchema()
        return transfer_schema.dump(transfer)
    else:
        abort(
            404, f"Transfer with id {id} not found"
        )
        
def create_transfer(transfer):
    id = transfer.get("id")

    transfer2 = {
      "id": db.session.query(func.max(Transfer.id)).scalar() + 1,
      "num": transfer.get("num"),
      "post": transfer.get("post"),
      "reason": transfer.get("reason"),
      "date": transfer.get("date")
    }
    transfer_schema = TransferSchema()
    new_transfer = transfer_schema.load(transfer2, session=db.session)
    db.session.add(new_transfer)
    db.session.commit()
    return transfer_schema.dump(new_transfer), 201

def update_transfer(transfer):
    id = transfer.get("id")
    existing_transfer = Transfer.query.filter(Transfer.id == id).one_or_none()

    if existing_transfer:
        transfer_schema = TransferSchema()
        update_transfer = transfer_schema.load(transfer, session=db.session)
        existing_transfer.num = update_transfer.num
        existing_transfer.post = update_transfer.post
        existing_transfer.reason = update_transfer.reason
        existing_transfer.date = update_transfer.date
        db.session.merge(existing_transfer)
        db.session.commit()
        return transfer_schema.dump(existing_transfer), 201
    else:
        abort(
            404,
            f"Transfer with id {id} not found" 
        )

def delete_transfer(id):
    existing_transfer = Transfer.query.filter(Transfer.id == id).one_or_none()

    if existing_transfer:
        db.session.delete(existing_transfer)
        db.session.commit()
        return make_response(f"Transfer with id {id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Transfer with id {id} not found"
        )