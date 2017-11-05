install:
	rsync -arvuz --delete ./ ~/Library/Application\ Support/Adobe/CEP/extensions/PColor/ --exclude .git/ --exclude .DS_Store