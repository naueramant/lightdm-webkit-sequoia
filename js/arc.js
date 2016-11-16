var _theme = null;
var _greeter = null;

class ArcGreeter {
	constructor() {
		if ( null !== _greeter ) {
			return _greeter;
		}
		_greeter = this;

		return _greeter;
	}

	show_prompt(text, type) {
		if ( 'password' === type ) {
			_theme.$passwordField.prop( "disabled", true );
			_theme.$cancelButton.prop( "disabled", true );
			_theme.$loginButton.prop( "disabled", true );
			lightdm.provide_secret(_theme.$passwordField.val());
		}
	}

	show_message(text, type) {
		if ( text.length > 0 ) {
			_theme.add_notification("info-circle", "#fff", text);
		}
	}

	show_error(text) {
		if ( text.length > 0 ) {
			_theme.add_notification("info-circle", "#F7CA18", text);
			_theme.hide_user_login();
		}
	}


	start_authentication(username) {
		if (_theme.$usernameField.is(":visible")){
			username = _theme.$usernameField.val();
		}

		_theme.username = username;

		if(!lightdm.in_authentication) {
			lightdm.cancel_authentication();
			lightdm.start_authentication(username);
		}
	}

	authentication_complete() {
		if ( !lightdm.is_authenticated ) {
			_theme.add_notification("exclamation-circle", "#d23232", "Login attempt failed for user " + _theme.username);
			_theme.$passwordField.val("");
			_theme.$passwordField.prop( "disabled", false );
			_theme.$cancelButton.prop( "disabled", false );
			_theme.$loginButton.prop( "disabled", false );
			_theme.$passwordField.addClass("red-outline");
			_theme.$passwordField.focus();
		}
		else {
			if(_theme.selected_session ) {
				_theme.$topPanel.css("top", -50);
				_theme.$bottomPanel.css("bottom", -50);
				_theme.$fadeInItems.css("opacity", 0);
				setTimeout(() => {
					lightdm.login( lightdm.authentication_user, _theme.selected_session.key );
				}, 1000);
			}

			else
				_theme.add_notification("exclamation-circle", "#F7CA18", "No session selected");
		}
	}

	autologin_timer_expired() {
		/* Stub.  Does nothing. */
	}
}

class ArcTheme {
	constructor() {
		if ( null !== _theme ) {
			return _theme;
		}
		_theme = this;

		this.user = null;
		this.username = null;
		this.userListFocus = false;
		this.actionListFocus = false;
		this.buttonsRowFocus = false;
		this.notListedBtnFocus = false;
		this.selected_session = lightdm.default_session;

		this.$clock = $( "#clock_widget" );
		this.$topPanel = $( ".top-panel" );
		this.$bottomPanel = $( ".bottom-panel" );
		this.$fadeInItems = $(".fade-in");
		this.$userList = $("#user-list");
		this.$userInfo = $("#user-info");
		this.$notificationArea= $("#notification-area");
		this.$loginBox= $("#login-input");
		this.$passwordField = $("#password-field");
		this.$usernameField = $("#username-field");
		this.$loginLabel = $("#not-listed-btn");
		this.$usernameBox = $("#username-box");
		this.$sessionList= $("#session-list");
		this.$cancelButton = $("#cancel-button");
		this.$loginButton = $("#login-button");

		this.Initialize();

		return _theme;
	}

	Initialize() {

		if(prefs["allow_anonymous_login"])
			_theme.$loginLabel.show();
		else
			_theme.$loginLabel.hide();

		this.Initialize_buttons();

		$(window).load(()=>{
			setTimeout(()=>{
				this.$topPanel.css("top", 0);
				this.$bottomPanel.css("bottom", 0);
				this.$fadeInItems.css("opacity", 1);
			}, 200);
		});

		if(prefs["background_image_visible"]) {
			$("#background").css({
				"opacity": 1-prefs["background_opacity"],
				"background-color": prefs["background_overlay_color"]
			});
			$("body").css("background-image", "url(" + prefs["background_image"] + ")");
		}

		$(document.body).keydown((ev)=>{
			//enter
		    if (ev.which === 13) {
		    	if(_theme.$passwordField.is(":focus"))
		    		_greeter.start_authentication(_theme.user.name);
		    	else
					$(':focus').click();
		    }
		    //escape
		    else if (ev.which === 27) {
		    	_theme.hide_user_login();
		    }

		    else if (_theme.$usernameField.is(":focus")) {
			    //down
			    if (ev.which === 40) {
			    	$('#password-field').focus();
			    }
		    }

		    else if (_theme.$passwordField.is(":focus")) {
		    					//up
			    if (ev.which === 38) {
			    	if(_theme.$passwordField.is(":visible")){
			    		$('#username-field').focus();
			    	}
			    }

			    //down
			    if (ev.which === 40) {
			    	$('#not-listed-btn').focus();
			    	//$('#cancel-button').focus();
			    }
		    }

		    else if(_theme.notListedBtnFocus){
				//up
			    if (ev.which === 38) {
			    	if(_theme.$loginBox.is(":visible")){
			    		$('#password-field').focus();
			    		//$('#cancel-button').focus();
			    	}
			    	else
			    		_theme.$userList.children().last().focus();
			    }
			    //down
			    if (ev.which === 40) {
			    	$('#shutdown-btn').focus();
			    }
		    }

		    else if(_theme.buttonsRowFocus) {
		    	//left
			    if (ev.which === 37) {
			    	$(':focus').prev().focus();
			    }
			    //right
			    if (ev.which === 39) {
			    	$(':focus').next().focus();
			    }
			    //up
			    if (ev.which === 38) {
			    	$('#password-field').focus();
			    }
			    //down
			    if (ev.which === 40) {
			    	$('#not-listed-btn').focus();
			    }
		    }

		    else if(_theme.actionListFocus) {
		    	//left
			    if (ev.which === 37) {
			    	$(':focus').prev().focus();
			    }
			    //right
			    if (ev.which === 39) {
			    	$(':focus').next().focus();
			    }
				//up
			    if (ev.which === 38) {
			    	$('#not-listed-btn').focus();
			    }
		    }

		    else if(_theme.userListFocus) {
			    //up
			    if (ev.which === 38) {
			    	$(':focus').prev().focus();
			    }
			    //down
			    if (ev.which === 40) {
			    	if(_theme.$userList.children().last().is(":focus"))
			    		$('#not-listed-btn').focus();
			    	else
			    		$(':focus').next().focus();
			    }
		    }
		});

		this.$sessionList.on("change", ()=>{
			_theme.selected_session = lightdm.sessions[this.selectedIndex];
		});


		$("#not-listed-btn").focusin(()=>{
			this.notListedBtnFocus = true;
		}).focusout(()=>{
			this.notListedBtnFocus = false;
		});

		this.$userList.focusin(()=>{
			this.userListFocus = true;
		}).focusout(()=>{
			this.userListFocus = false;
		});

		$(".buttons-row").focusin(()=>{
			this.buttonsRowFocus = true;
		}).focusout(()=>{
			this.buttonsRowFocus = false;
		});

		$(".bottom-panel-inner").focusin(()=>{
			this.actionListFocus = true;
		}).focusout(()=>{
			this.actionListFocus = false;
		});

		this.initialize_clock();
		this.list_users();
		this.list_sessions();
	}

	Initialize_buttons() {
		if(lightdm.can_shutdown && prefs["allow_shutdown"])
			$("#shutdown-btn").css("display", "inherit");
		if(lightdm.can_restart && prefs["allow_restart"])
			$("#restart-btn").css("display", "block");
		if(lightdm.can_suspend && prefs["allow_suspend"])
			$("#suspend-btn").css("display", "block");
		if(lightdm.can_hibernate && prefs["allow_hibernate"])
			$("#hibernate-btn").css("display", "block");
	}

	initialize_clock() {
		moment.locale( window.navigator.languages );
		this.$clock.html( moment().format( prefs["clock_format"] ) );

		setInterval( () => {
			_theme.$clock.html( moment().format( prefs["clock_format"] ) );
		}, 1000 );
	}

	list_users() {
		if(lightdm.users.length == 1 && prefs["one_user_auto_select"]){
			this.show_user_login(lightdm.users[0]);
		}

		for ( var user of lightdm.users ) {
			this.add_user(user, true);
		}

		this.$userList.children().first().focus();
	}

	list_sessions() {
		for ( var session of lightdm.sessions ) {
			_theme.$sessionList.append($("<option></option>")
                    .attr("value", session.name)
                    .text(session.name));
		}
	}

	add_user(user, isList){
		var userImage = user.image ? user.image : prefs["default_user_image"] ;

		if(isList) {
			this.$userList.append(()=>{
				return $('<li class="user-tile" tabindex="0"><img src="' + prefs["default_user_image"] + '">' + user.name + '</li>')
						.on("click", function() {
						    var index =  _theme.$userList.children().index(this);
						    _theme.show_user_login(lightdm.users[index]);
						});
			});
		} else {
			var html = '<img height="150" width="150" src="' + userImage + '" class="round-image">' + user.name;
			this.$userInfo.empty().append(html);
		}
	}

	add_notification(icon, color, text){
		var rid = makeid();
		var timestamp = moment().format( prefs["notification_clock_format"] );
		this.$notificationArea.append('<div id="' + rid + '"><i class="fa fa-' + icon + '" aria-hidden="true" style="color: ' + color + ';"><div class="notification-text"><font size="2">' + timestamp + '</font><br><br>' + text + '</div></i></div>');
		$("#" + rid).hide().fadeIn("slow").css("display", "inline-block").on("click", ()=> {
			//$("#" + rid).remove()
		});
	}

	show_user_login(user){
		_theme.user = user;
		_theme.$passwordField.val("");
		_theme.add_user(user, false);
		_theme.$loginBox.show();
		_theme.$userList.hide();
		_theme.$usernameBox.hide();
		_theme.$loginLabel.text("Sign in with another user");
		_theme.$passwordField.focus();
	}

	show_anonymous_login(){
		if(lightdm.in_authentication)
			return;

		var html = '<img height="150" width="150" src="' + prefs["default_user_image"] + '" class="round-image">';
		_theme.$userInfo.empty().append(html);
		_theme.$passwordField.removeClass("red-outline");
		_theme.$passwordField.val("");
		_theme.$usernameField.val("");
		_theme.$loginBox.show();
		_theme.$userList.hide();
		_theme.$usernameBox.show();
		_theme.$loginLabel.text("Sign in with another user");
		_theme.$usernameField.focus();
	}

	hide_user_login(){
		if(lightdm.in_authentication)
			return;

		_theme.$passwordField.removeClass("red-outline");
		_theme.$userList.show();
		_theme.$loginBox.hide();
		_theme.$userList.children().first().focus();
		_theme.$loginLabel.text("Not listed?");


		if(prefs["allow_anonymous_login"])
			_theme.$loginLabel.show();
		else
			_theme.$loginLabel.hide();
	}

	switch_view(){
		if(_theme.$passwordField.is(":visible"))
			this.hide_user_login();
		else
			this.show_anonymous_login();
	}
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Initialize the theme once the window has loaded.
 */

arc = {}
arc.greeter = new ArcGreeter();
arc.theme = new ArcTheme();


//Make methods public for lightdm-webkit
var show_prompt = arc.greeter.show_prompt;
var show_message = arc.greeter.show_message;
var start_authentication = arc.greeter.start_authentication;
var cancel_authentication = arc.greeter.cancel_authentication;
var authentication_complete = arc.greeter.authentication_complete;
var autologin_timer_expired = arc.greeter.autologin_timer_expired;
var show_error = arc.greeter.show_error;

