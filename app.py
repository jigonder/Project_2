from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_news

# Create an instance of Flask
app = Flask(__name__)

# setup mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/fin_app")


@app.route("/")
def home():
    # Find record from MongoDB and render the template
    news = mongo.db.collection.find_one() # filter by date

    # Return template and data
    return render_template("index.html", newsDoc=news)
    

# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():

    # Run the scrape function
    news = scrape_news.scrape()

    # Update the Mongo database using update and upsert=True (maybe lock to something other than button)
    mongo.db.collection.update({}, news, upsert=True)

    # Redirect back to home page
    return redirect("/")

@app.route("/miseryindex")
def misery():

    return render_template("misery.html")
    

@app.route("/stockindex")
def stocks():
    return render_template("stockSearch.html")

if __name__ == "__main__":
    app.run(debug=True)
