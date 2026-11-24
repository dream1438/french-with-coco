#!/usr/bin/env bash
# Installs the test APK on the running emulator, opens a few screens and saves screenshots.
set -u
APK="$1"; OUT="$2"; PKG=com.languageswithcoco.french; S=com.languageswithcoco.french://open
mkdir -p "$OUT"
adb install -r "$APK"
shot() { sleep "$2"; adb exec-out screencap -p > "$OUT/android-$1.png"; }
go() { adb shell am start -a android.intent.action.VIEW -d "$1" $PKG >/dev/null 2>&1; }
adb shell monkey -p $PKG -c android.intent.category.LAUNCHER 1 >/dev/null
shot 1-home 15
go "$S/lesson/A1-01";  shot 2-lesson 5
go "$S/quiz/A1-01";    shot 3-quiz 4
go "$S/play/A1-01/match"; shot 4-game 4
go "$S/progress";      shot 5-progress 4
adb shell input keyevent 4; shot 6-back-button 3
adb logcat -d | grep -iE "Capacitor|chromium|Console|AndroidRuntime" | tail -120 > "$OUT/android-log.txt" || true
ls -la "$OUT"
