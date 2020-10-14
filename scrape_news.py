# Get main economics headline from cnbc.com/economy
def scrape():
    # Import dependencies
    from splinter import Browser
    from bs4 import BeautifulSoup as bs
    import pandas as pd 

    # Initiate headless driver for deployment
    browser = Browser("chrome", executable_path="drivers/chromedriver", headless=True)

    # url for cnbc news
    url = "https://www.cnbc.com/economy/"
    # Open headless browser at url
    browser.visit(url)

    # Delay to run code until image loads in html by css
    browser.is_element_present_by_css(".Card-mediaContainerInner .Card-titleAndFooter", wait_time=1)

    # Get headless browser html as soup object, then quit the browser
    html = browser.html
    news_soup = bs(html, 'html.parser')

    browser.quit()

    # grab what we want from the soup
    # first locate html of featured article
    try:
        img_cont = news_soup.find('div', class_="Card-standardBreakerCard Card-featuredRectangleMediaImagedense Card-featuredRectangleMedia Card-card")
    except:
        print("FEATURED IMAGE NOT FOUND")
    
    # grab the image link
    image_link = img_cont.find('img',class_="Card-mediaContainerInner")['src']
    # grab the article link
    image_article_link = img_cont.find('a')['href']
    # grab the article headline
    image_text= img_cont.find('div',{"class","Card-titleContainer"}).find('div').text
    # grab the author name
    author = img_cont.find('span',class_="Card-byline").find('a').text
    # grab the author link
    author_link = img_cont.find('span',class_="Card-byline").find('a')['href']
    # grab the date
    date = img_cont.find('span',class_="Card-time").text


    print("IMAGE LINK", image_link)
    print("ARTICL LINK", image_article_link)
    print("IMAGE TEXT", image_text)
    print("AUTHOR", author)
    print("AUTHOR LINK", author_link)
    print("IMAGE DATE", date)

    return {
        "imgLink": image_link,
        "articleLink": image_article_link,
        "imgText": image_text,
        "author": author,
        "authorLink": author_link,
        "iDate": date
    }
    
if __name__ == "__main__":
    scrape()