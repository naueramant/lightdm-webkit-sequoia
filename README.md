## Sequoia LightDM Webkit2 greeter theme

This is a theme for LightDM Webkit2 (`lightdm-webkit2-greeter`).

### Screenshots

![](http://i.imgur.com/zjBEVEk.png)
![](http://i.imgur.com/Xiyg77r.png)

### Features

I created this for use on Arch Linux, so it only has the basic features of:

- Selecting an available user from a dropdown
- Entering their password
- Seeing their profile picture
- Restarting the computer
- Shutting the computer down
- Suspending the computer
- Hibernate
- Select session (GNOME, KDE, Xfce or other installed DE)
- Easy configuration from config.js
- Faild login notification

### How to install

#### AUR Linux

Download from AUR [`lightdm-webkit-theme-sequoia-git`](https://aur.archlinux.org/packages/lightdm-webkit-theme-sequoia-git/)Enable the theme in your /etc/lightdm/lightdm-webkit2-greeter.conf Search for greeter section Set webkit-theme to sequoia

#### Manuel from github

Instructions will differ for every distribution:

- Install and enable lightdm and lightdm-webkit2-greeter
- In the terminal, cd to /usr/share/lightdm-webkit/themes/
- Clone this repository (git clone https://github.com/naueramant/lightdm-webkit-sequoia sequoia)
- Enable the theme in your /etc/lightdm/lightdm-webkit2-greeter.conf
- Search for greeter section
- Set webkit-theme to sequoia

### Setting your own user picture

Add `Icon=/var/lib/AccountsService/icons/<youraccountname>` to the bottom of `/var/lib/AccountsService/users/<youraccountname>` and place a profile image at `/var/lib/AccountsService/icons/<youraccountname>`

### Configuration

### Tips
#### Lock screen
- Type `dm-tool lock`