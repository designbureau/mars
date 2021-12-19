#	Put the 3ds models in your "models" folder
#	Put the textures in your "hires" folder

#	The albedomaps are made from data that I got by combining data from:
#	http://www.ssc.uwo.ca/geography/spacemap/ 

#	I did some touchups in photoshop and added color from pictures from other nasa sources.

#	The models are created from shapedata from:
#	http://publish.uwo.ca/~pjstooke/plancart.htm
#	I also added extra detail by generating heightdata using photoclinometry (shape from shading).
#	this heightdata is just for aestetic purposes and should not be treated as "correct".
#	The Shape from Shading data is supplied as bumpmap textures if you want to play with them on your own.
#	I also supply 2 normalmaps that you could use instead of my hires models if celesta ever gets normalmapping support for meshes.

#	Mattias Malmer

"Phobos" "Sol/Mars"
{
	Mesh "phobos.3ds"
	Texture "phobos_albedo.*"
}



"Deimos" "Sol/Mars"
{
	Mesh "deimos.3ds"
	Texture "deimos_albedo.*"
}