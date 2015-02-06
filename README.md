# inkdb.org

And exploration in mixing React with inkcyclopedia.org, showing the 380+ fountain pen inks that I've written with so far, in a hopefully visually interesting manner.

Right now there are two views:

1. grid view, which is your standard boring "ordered on ..." view (hue, by default), and
2. the colour cloud view, which shows you colors that are visually near the one you're focussed on, based on the [L*a*b](http://en.wikipedia.org/wiki/Lab_color_space) colour space, currently the best model we have for "what humans experience as visually similar colours".

Clicking a colour in grid view takes you to the cloud view of that color, clicking the main color in the cloud view takes you back to the grid view. Clicking any other colour in cloud view realigns the cloud to focus on that colour instead.

For questions and comments, hit up the issues, or tweet at me ([TheRealPomax](http://twitter.com/TheRealPomax)
