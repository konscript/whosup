#########################################
# SHORTHAND FUNCTION
#########################################

function balancebot {
	echo -ne "\033]0;BB Dir\007"
	echo "### Changed directory to balancebot folder"
    cd /srv/balancebot/
}
function balancebot! {
    echo -ne "\033]0;KS Server\007"
	echo "### Starting GAE"
	/srv/google_appengine/dev_appserver.py --enable_sendmail --log_level=error --port=8080 --host=0.0.0.0 /srv/balancebot/ --admin_host 0.0.0.0 --admin_port=8090
}
function balancebot_watch {
    echo -ne "\033]0;KS Watch\007"
    echo "### Compass watching CSS changes"
    cd /srv/balancebot/static/app/ && compass watch
}

alias balancebot_remote_api='python /srv/google_appengine/remote_api_shell.py -s localhost:8080'

################################
# IMORT, EXPORT, DEPLOYMENT
################################

function balancebot_deploy {
	trap after_termination EXIT
	set -e
	__deploy_to_appengine $1 disable-minify
}

function balancebot_deploy_minified {
	trap after_termination EXIT
	set -e
	__deploy_to_appengine $1 minify
}

function balancebot_update_gae_sdk {
	# default to version 1.7.4
	if [ -z $1 ]; then
		echo "asd"
		VERSION="1.7.6"
	else
		VERSION=$1
	fi

	read -p "Proceed updating to GAE version ${VERSION} (y/n)? " -n 1
	if [[ ! $REPLY =~ ^[Yy]$ ]]
	then
		printf "\nUpdated aborted\n"
	else
		printf "\n * Starting upgrade\n"

		FILENAME="google_appengine_${VERSION}.zip"

		# go to srv dir
		cd /srv/

		# file doesn't exist
		if [ ! -f ${FILENAME} ]; then
			echo " * Downloading SDK ${VERSION}"

			# download sdk
			wget http://googleappengine.googlecode.com/files/${FILENAME}
		fi

		# sdk zip was downloaded successfully
		if [ -f ${FILENAME} ]; then
			echo " * Removing old SDK"

			# remove old sdk
			rm -rf google_appengine/

			# unzip
			unzip ${FILENAME} > /dev/null 2>&1

			echo " * SDK successfully upgraded!"
		fi
	fi
}



function __deploy_to_appengine {

	VERSION=$1
	MINIFY=$2
	BACKEND=$3

	echo " * Compiling Compass"
	compass compile /srv/balancebot --quiet

	echo " * Compiling Python templates"
	cd /srv/balancebot && python /srv/balancebot/compile_templates.py

	# Compile js
	balancebot_compile_javascript $MINIFY

	# deploy to backend
	if [ ! -z "$BACKEND" ] && [ $BACKEND == "backend" ]; then
		echo "Deploying to backend"
		/srv/google_appengine/appcfg.py backends /srv/balancebot/ update

	# deploy to frontend
	else
		echo "Deploying to frontend (default)"
		/srv/google_appengine/appcfg.py update /srv/balancebot/
	fi
}

function balancebot_deploy_backend {
	__deploy_to_appengine $1 minify backend
}

################################
# JAVASCRIPT COMPILATION, MINIFICATION, REMOVING CONSOLE_LOG
################################

function __remove_console_logs {

	echo " * Removing console.log()"

	# remove in root folder
	# -E: extended regular expression
	# --in-place: write changes to file, instead of outputting them
	sed --in-place -E 's/console.log\((.*)\);?//g' /srv/balancebot/static/compiled/app/js/*.js

	# Remove in specific folders
	find /srv/balancebot/static/compiled/app/js/ -type f -print0 |  xargs -0 sed --in-place -E 's/console.log\((.*)\);?//g'
}

function balancebot_jshint {
	echo " * Running JSHint"

	original_dir=$PWD
    cd /srv/balancebot/static/app/js/
    jshint .
    cd $original_dir
}

function __balance_combine_and_minify_javascript {
    FILE=$1
    MINFY=$2
    OUTPUT_FILE="/srv/balancebot/static/$FILE.js"
    HTML_TEMPLATE="/srv/balancebot/templates/$FILE.html"

    # get javascript files (and their content)
    JAVASCRIPT_FILES=`grep --only-matching '/app.*\.js' $HTML_TEMPLATE | sed  's/\/static/\/srv\/balancebot\/static\/compiled/g' | cut --delimiter ? --fields -1`

    # Save raw files
    if [ ! -z "$MINFY" ] && [ $MINFY == "disable-minify" ]; then
        echo $JAVASCRIPT_FILES | cat $(xargs) > $OUTPUT_FILE
        echo "Saved to $OUTPUT_FILE"

    # minify
    else
        java -jar /srv/balancebot/.tools/compiler.jar --warning_level=quiet --compilation_level SIMPLE_OPTIMIZATIONS --js $JAVASCRIPT_FILES --js_output_file $OUTPUT_FILE
		if [ $? -ne 0 ]; then
		    echo " !! Abort !!"
		else
			echo " = Minified and saved to $OUTPUT_FILE"
		fi
    fi
}

function balancebot_compile_javascript {

	# Minify or not flag
	MINIFY=$1

	balancebot_jshint

	# cleanup
	echo " * Removing old JS structure"
	rm -rf /srv/balancebot/static/compiled/js/

	# clone js
	echo " * Cloning new JS structure"
	cp -r /srv/balancebot/static/app/js/ /srv/balancebot/static/compiled/app/js

	# Remove console logs
	__remove_console_logs

	# combine and minify
	__balance_combine_and_minify_javascript index $MINIFY
}
complete -W "disable-minify minify" balancebot_compile_javascript
