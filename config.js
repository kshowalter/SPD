require.config({
    //By default load any module IDs from js/lib
    baseUrl: './',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        //app: '../app',
        k: "lib/k/k",
        k_DOM: "lib/k/k_DOM",
        k_DOM_extra: "lib/k/k_DOM_extra",
        k_data: "lib/k/k_data",
    },

    deps: ["app/main"],
});
