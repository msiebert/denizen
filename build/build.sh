#set path variables
CLOSURE="../lib/closure-library/closure/bin/build"

../lib/closure-library/closure/bin/build/closurebuilder.py \
	--root=../lib/closure-library \
	--root=../app/js/denizen/ \
	--output_mode=compiled \
	--namespace="denizen" \
	--compiler_jar=../lib/compiler.jar \
	--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
	--compiler_flags="--jscomp_error=checkTypes" \
	--compiler_flags="--jscomp_error=invalidCasts" \
	--compiler_flags="--jscomp_error=deprecated" \
	--compiler_flags="--jscomp_error=strictModuleDepCheck" \
	--compiler_flags="--jscomp_error=missingProperties" \
	--compiler_flags="--jscomp_error=checkVars" \
	--compiler_flags="--jscomp_error=unknownDefines" \
	--compiler_flags="--jscomp_error=undefinedVars" \
	--compiler_flags="--jscomp_error=fileoverviewTags" \
	--compiler_flags="--jscomp_error=nonStandardJsDocs" \
	--compiler_flags="--externs=externs/three.js" \
	> ../app/js/denizen-compiled.js

