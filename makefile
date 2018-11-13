fix-imports:
	find ./src -name "**.ts*" -exec importjs rewrite --overwrite {} \;

prettier:
	cd src
	yarn prettier --write "**/*.ts*"

eslint-fix:
	yarn eslint --fix

tsc:
	yarn tsc -p ./ --noEmit

tsc-watch:
	yarn tsc -p ./ --noEmit -w

install-clean-version: clean build install_build

build:
	cd android; ./gradlew assembleRelease

install-build:
	react-native run-android --variant=release

# test:
# 	yarn jest --bail --color --watch --notify

# test-current:
# 	yarn test --bail --color --watch --notify -t Content

install:
	react-native run-android

log:
	adb logcat | grep 'ReactNative'

kill:
	fuser -k -n tcp 8081

clean-react:
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

run: bridge
	yarn start

add-types:
	inv add-types

bridge:
	~/Android/Sdk/platform-tools/adb reverse tcp:8081 tcp:8081
