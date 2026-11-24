#!/usr/bin/env bash
# Boots an iPhone simulator, installs the app, opens a few screens and saves screenshots.
set -u
APP="$1"; OUT="$2"; BID=com.languageswithcoco.french; S=com.languageswithcoco.french://open
mkdir -p "$OUT"
UDID=$(xcrun simctl list devices available -j | python3 -c "
import json,sys
d=json.load(sys.stdin)['devices']
c=[x for k,v in d.items() if 'iOS' in k for x in v if x['name'].startswith('iPhone') and 'Pro' in x['name'] and 'Max' not in x['name']]
c=c or [x for k,v in d.items() if 'iOS' in k for x in v if x['name'].startswith('iPhone')]
print(c[-1]['udid'])")
xcrun simctl boot "$UDID"; xcrun simctl bootstatus "$UDID" -b
xcrun simctl status_bar "$UDID" override --time 9:41 --batteryState charged --batteryLevel 100 || true
xcrun simctl install "$UDID" "$APP"
xcrun simctl launch "$UDID" $BID
shot() { sleep "$2"; xcrun simctl io "$UDID" screenshot "$OUT/iphone-$1.png"; }
shot 1-home 15
xcrun simctl openurl "$UDID" "$S/lesson/A1-01"; shot 2-lesson 5
xcrun simctl openurl "$UDID" "$S/quiz/A1-01"; shot 3-quiz 4
xcrun simctl openurl "$UDID" "$S/play/A1-01/match"; shot 4-game 4
xcrun simctl openurl "$UDID" "$S/progress"; shot 5-progress 4
ls -la "$OUT"
