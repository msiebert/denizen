../lib/closure-library/closure/bin/build/closurebuilder.py \
	--root=../lib/closure-library \
	--root=../app/js/denizen/ \
	--output_mode=compiled \
	--namespace="denizen" \
	--compiler_jar=../lib/compiler.jar \
	--compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
	--compiler_flags="--jscomp_error=checkTypes" \
	--compiler_flags="--jscomp_error=checkVars" \
	--compiler_flags="--jscomp_error=deprecated" \
	--compiler_flags="--jscomp_error=duplicate" \
	--compiler_flags="--jscomp_error=fileoverviewTags" \
	--compiler_flags="--jscomp_error=invalidCasts" \
	--compiler_flags="--jscomp_error=missingProperties" \
	--compiler_flags="--jscomp_error=nonStandardJsDocs" \
	--compiler_flags="--jscomp_error=strictModuleDepCheck" \
	--compiler_flags="--jscomp_error=undefinedVars" \
	--compiler_flags="--jscomp_error=unknownDefines" \
	--compiler_flags="--jscomp_error=visibility" \
	--compiler_flags="--jscomp_warning=reportUnknownTypes" \
	> ../app/js/denizen-compiled.js;

../lib/closure-library/closure/bin/build/depswriter.py \
	--root_with_prefix="../app/js/denizen ./app/js/denizen" \
	--root_with_prefix="../lib/closure-library ./lib/closure-library" \
	> ../app/js/deps.js;

