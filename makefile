screenshoot:
	@read -p "Enter filename:" screen_name; \
	screen_path=/sdcard/Download/Sync/share/$$screen_name.png; \
	~/Android/Sdk/platform-tools/adb shell screencap $$screen_path

# android/app/build/outputs/apk/app-release.apk
pub: clean build install_build

build:
	cd android; ./gradlew assembleRelease

install_build:
	react-native run-android --variant=release

test:
	./node_modules/.bin/jest --bail --color --watch --notify

testCurrent:
	./node_modules/.bin/jest --bail --color --watch --notify -t move

install:
	react-native run-android

log:
	react-native log-android

log1:
	adb logcat | grep 'ReactNative'

kill:
	fuser -k -n tcp 8081

clean:
	rm -rf /tmp/metro-cache; \
	watchman watch-del-all; \
	rm -rf $TMPDIR/react-native-packager-cache-*; \
	rm -rf $TMPDIR/haste-map-react-native-packager-*; \

clean1:
	yarn install; \
	yarn link org-mode-connection
	rm -rf node_modules; \
	rm -rf android/build; \

cleanYarn:
	yarn cache clean; \
	yarn install; \
	yarn link org-mode-connection

run:
	~/Android/Sdk/platform-tools/adb reverse tcp:8081 tcp:8081
	yarn start

bridge:
	~/Android/Sdk/platform-tools/adb reverse tcp:8081 tcp:8081
