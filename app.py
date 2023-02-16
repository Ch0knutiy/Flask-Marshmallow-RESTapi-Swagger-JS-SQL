# app.py

from flask import render_template 
import config

app = config.connex_app
app.add_api(config.basedir / "swagger.yml")

@app.route("/")
def home():
    return render_template("cities.html")

@app.route("/cities")
@app.route("/cities/<int:city_id>")
def cities(city_id=""):
    """
    This function just responds to the browser URL
    localhost:5000/products

    :return:        the rendered template "products.html"
    """
    return render_template("cities.html", city_id=city_id)

@app.route("/transfer")
@app.route("/transfer/<int:id>")
def transfers(id=""):    
    return render_template("transfer.html", id=id)

@app.route("/employee")
@app.route("/employee/<int:id>")
def employee(id=""):    
    return render_template("employee.html", id=id)

@app.route("/route")
@app.route("/route/<int:id>")
def route(id=""):    
    return render_template("route.html", id=id)

@app.route("/hotel")
@app.route("/hotel/<int:id>")
def hotel(id=""):    
    return render_template("hotel.html", id=id)

@app.route("/company")
@app.route("/company/<int:id>")
def company(id=""):    
    return render_template("company.html", id=id)

@app.route("/country")
@app.route("/country/<int:id>")
def country(id=""):    
    return render_template("country.html", id=id)

@app.route("/client")
@app.route("/client/<int:id>")
def client(id=""):    
    return render_template("client.html", id=id)

@app.route("/ticket")
@app.route("/ticket/<int:id>")
def ticket(id=""):    
    return render_template("ticket.html", id=id)

@app.route("/flights")
@app.route("/flights/<string:num>")
def flights(num=""):    
    return render_template("flights.html", num=num)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)