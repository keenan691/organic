# * React Native makefile

# ** Run

run: adb-reverse
	yarn start

adb-reverse:
	adb reverse tcp:8081 tcp:8081
	adb reverse tcp:9090 tcp:9090
	adb reverse tcp:7007 tcp:7007

# ** Installation

install-clean-version: clean build install_build

run-android:
	react-native run-android

yarn-install:
	yarn install

typesync:
	typesync

# ** Logs

log:
	adb logcat | grep 'ReactNative'

log-debug:
	adb logcat | grep 'D ReactNativeJS:'

log-warning:
	adb logcat | grep 'W ReactNativeJS:'

log-error:
	adb logcat | grep 'E ReactNativeJS:'

log-info:
	adb logcat | grep 'I ReactNativeJS:'

# ** Tests

test-update-snapshot:
	yarn jest --updateSnapshot

test:
	yarn jest --bail --color --watch --notify

test-current:
	yarn test --bail --color --watch --notify -t Content

# ** Build

build:
	cd android; ./gradlew assembleRelease

install-build:
	react-native run-android --variant=release

# ** Code fixing

fix-imports:
	find ./src -name "**.{ts,tsx}" -exec importjs rewrite --overwrite {} \;

fix-prettier:
	prettier --write "src/**/*.{ts,tsx}"

fix-eslint:
	yarn eslint --fix

fix-tslint:
	tslint --project ./tsconfig.json --fix

tsc:
	yarn tsc -p ./ --noEmit

tsc-watch:
	yarn tsc -p ./ --noEmit -w

# ** Clean

kill:
	fuser -k -n tcp 8081

clean-packager:
	rm -rf /tmp/metro-cache; \
	watchman watch-del-all; \
	rm -rf $TMPDIR/react-native-packager-cache-*; \
	rm -rf $TMPDIR/haste-map-react-native-packager-*; \

clean1:
	yarn install; \
	rm -rf android/build; \

clean-yarn:
	yarn cache clean; \
	rm -rf node_modules; \
	yarn install; \
