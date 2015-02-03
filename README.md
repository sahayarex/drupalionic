# drupalionic
A framework for ionic mobile apps with drupal backend.

<img src="icon.png" \>

Dependencies:

1. ionic
2. drupal website.

Installation:

1. git clone https://github.com/sahayarex/drupalionic.git
2. cd drupalionic

Drupal:

3. Take the drupalionic module from the folder "module_for_drupal" 
   and install the module in your drupal 7 installation.
   (Make sure the dependencies of drupalionic module also installed)

Ionic:

4. Open www/js/services.js on line 3 change baseUrl to ur drupal server url
5. ionic platform add android/ios(android is already added in the code)
6. ionic run android/ios

Thats it. Wow you get the mobile app with login, start logging in and check it.

