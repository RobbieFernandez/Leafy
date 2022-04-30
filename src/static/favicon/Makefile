favicon.ico: 16.png 32.png 48.png
	convert $^ $@

%.png: icon.svg
	inkscape --export-filename=$@ -w $* -h $* icon.svg

clean:
	rm *.png