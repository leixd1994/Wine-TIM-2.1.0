#!/bin/bash
EXEPATH=$(cd `dirname $0`;pwd)
export WINEPREFIX=$EXEPATH/tim
export WINEDEBUG=-all
export LANG=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8
cd "$EXEPATH/tim/drive_c/Program Files (x86)/Tencent/TIM/Bin"
wine TIM.exe
