# models.py

from config import db, ma
from marshmallow_sqlalchemy import fields
from marshmallow import INCLUDE



class Country(db.Model):
    __tablename__ = "country"
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(20))

class CountrySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Country
        load_instance = True
        sqla_session = db.session
        include_fk = True

country_schema = CountrySchema()
countries_schema = CountrySchema(many=True)

class City(db.Model):
    __tablename__ = "city"
    city_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    city_name = db.Column(db.String(15))
    city_country = db.Column(db.Integer, db.ForeignKey('country.id'))

class CitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = City
        load_instance = True
        sqla_session = db.session
        include_fk = True

city_schema = CitySchema()
cities_schema = CitySchema(many=True)
 
class Transfer(db.Model):
    __tablename__ = "transfer"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    num = db.Column(db.Integer)
    post = db.Column(db.String(100))
    reason = db.Column(db.String(100))
    date = db.Column(db.Date)

class TransferSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Transfer
        load_instance = True
        sqla_session = db.session
        include_fk = True
        
transfer_schema = TransferSchema()
transfers_schema = TransferSchema(many=True)

class Employee(db.Model):
    __tablename__ = "employee"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    surname = db.Column(db.String(20))
    name = db.Column(db.String(20))
    patronymic = db.Column(db.String(20))
    address = db.Column(db.String(30))
    birth = db.Column(db.Date)
    post = db.Column(db.String(20))
    salary = db.Column(db.Integer)
    transfer_id = db.Column(db.Integer, db.ForeignKey('transfer.id'))
    # transfer = db.relationship(Transfer, backref=db.backref('employee'), uselist=False)
    phone = db.Column(db.String(11))

class EmployeeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Employee
        load_instance = True
        sqla_session = db.session
        include_fk = True
        include_relationships = True
        
        
employee_schema = EmployeeSchema()
employees_schema = EmployeeSchema(many=True)

class Hotel(db.Model):
    __tablename__ = "hotel"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    clazz = db.Column(db.Integer)
    categories = db.Column(db.String(100))

class HotelSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Hotel
        load_instance = True
        sqla_session = db.session
        include_fk = True
        
hotel_schema = HotelSchema()
hotels_schema = HotelSchema(many=True)

class Flights(db.Model):
    __tablename__ = "flights"
    num = db.Column(db.String(13), primary_key=True)
    date = db.Column(db.Date)
    time = db.Column(db.Time)
    aircraft = db.Column(db.String(12))
    clazz =  db.Column(db.String(1))
    free = db.Column(db.Integer)

class FlightsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Flights
        load_instance = True
        sqla_session = db.session
        include_fk = True

flight_schema = FlightsSchema()
flights_schema = FlightsSchema(many=True)

class Ticket(db.Model):
    __tablename__ = "ticket"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flight_num = db.Column(db.String(13), db.ForeignKey('flights.num'))
    # flight = db.relationship(Flights, backref=db.backref('ticket'), uselist=False)
    seat = db.Column(db.Integer)
    id_client = db.Column(db.Integer, db.ForeignKey('client.id'))
    # client = db.relationship(Client, backref=db.backref('ticket'), uselist=False)

class TicketSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Ticket
        load_instance = True
        sqla_session = db.session
        include_fk = True
        include_relationships = True
        

ticket_schema = TicketSchema()
tickets_schema = TicketSchema(many=True)

class Company(db.Model):
    __tablename__ = "company"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    flights_num = db.Column(db.String(13), db.ForeignKey('flights.num'))
    # flight = db.relationship(Flights, backref=db.backref('company'), uselist=False)

class CompanySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        load_instance = True
        sqla_session = db.session
        include_fk = True
        include_relationships = True
        

company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)

class Route(db.Model):
    __tablename__ = "route"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    city_id = db.Column(db.Integer, db.ForeignKey('city.city_id'))
    # city = db.relationship(City, backref=db.backref('route'), uselist=False)
    duration = db.Column(db.String(100))
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.id'))
    # hotel = db.relationship(Hotel, backref=db.backref('route'), uselist=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    # company = db.relationship(Company, backref=db.backref('route'), uselist=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    # employee = db.relationship(Employee, backref=db.backref('route'), uselist=False)

class RouteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Route
        load_instance = True
        sqla_session = db.session
        include_fk = True
        include_relationships = True
        

route_schema = RouteSchema()
routes_schema = RouteSchema(many=True)

class Client(db.Model):
    __tablename__ = "client"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    surname = db.Column(db.String(20))
    name = db.Column(db.String(20))
    patronymic = db.Column(db.String(20))
    phone = db.Column(db.String(11))
    date_of_buy = db.Column(db.Date)
    time_of_buy = db.Column(db.Time)
    route_id = db.Column(db.Integer, db.ForeignKey('route.id'))
    # route = db.relationship(Route, backref=db.backref('client'), uselist=False)
    

class ClientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Client
        load_instance = True
        sqla_session = db.session
        include_fk = True
        include_relationships = True
        
        
client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)

