## Sequoia LightDM Webkit2 greeter theme

This is a theme for LightDM Webkit2 (`lightdm-webkit2-greeter`).

Arch Linux users can find it in the AUR: [`lightdm-webkit-theme-sequoia-git`](https://aur.archlinux.org/packages/lightdm-webkit-theme-sequoia-git/).

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

blah

### Setting your own user picture

Add `Icon=/var/lib/AccountsService/icons/<youraccountname>` to the bottom of `/var/lib/AccountsService/users/<youraccountname>` and place a profile image at `/var/lib/AccountsService/icons/<youraccountname>`

### Configuration

### Tips
#### Lock screen
- Type `dm-tool lock`