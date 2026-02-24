// 🇺🇦 ДИВИСЬ UA — INIT BLOCK
// BASED ON nb557 CORE ENGINE
// DO NOT MODIFY THIS BLOCK

(function () {
    'use strict';

    var PLUGIN_NAME = 'UA_DYVYS';
    var PLUGIN_VERSION = '1.0.0';
    var PLUGIN_AUTHOR = 'UA Community';

    function startsWith(str, searchString) {
        return str.lastIndexOf(searchString, 0) === 0;
    }

    function endsWith(str, searchString) {
        var start = str.length - searchString.length;
        if (start < 0) return false;
        return str.indexOf(searchString, start) === start;
    }

    var myIp = '';

    // оставляем как в оригинале nb557 (обязательно)
    var currentFanserialsHost = decodeSecret(
        [95,57,28,42,55,125,28,124,75,83,86,35,27,63,54,46,82,63,9,27,89,40,28],
        atob('RnVja0Zhbg==')
    );

    function salt(input) {
        var str = (input || '') + '';
        var hash = 0;

        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            hash = (hash << 5) - hash + c;
            hash = hash & hash;
        }

        var result = '';

        for (var _i = 0, j = 32 - 3; j >= 0; _i += 3, j -= 3) {
            var x = ((hash >>> _i & 7) << 3) + (hash >>> j & 7);

            result += String.fromCharCode(
                x < 26 ? 97 + x :
                x < 52 ? 39 + x :
                x - 4
            );
        }

        return result;
    }

    function decodeSecret(input, password) {

        var result = '';

        password = (
            password ||
            Lampa.Storage.get('online_mod_secret_password', '')
        ) + '';

        if (input && password) {

            var hash = salt('123456789' + password);

            while (hash.length < input.length)
                hash += hash;

            var i = 0;

            while (i < input.length) {

                result += String.fromCharCode(
                    input[i] ^ hash.charCodeAt(i)
                );

                i++;
            }
        }

        return result;
    }

    function baseUserAgent() {

        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36';

    }

    function setMyIp(ip) {
        myIp = ip;
    }

    function getMyIp() {
        return myIp;
    }

    function checkMyIp(network, onComplite) {

        var ip = getMyIp();

        if (ip) {
            onComplite();
            return;
        }

        network.clear();
        network.timeout(10000);

        network.silent(
            'https://api.ipify.org/?format=json',

            function (json) {

                if (json.ip)
                    setMyIp(json.ip);

                onComplite();
            },

            function () {

                network.clear();
                network.timeout(10000);

                network.silent(
                    proxy('ip') + 'jsonip',

                    function (json) {

                        if (json.ip)
                            setMyIp(json.ip);

                        onComplite();
                    },

                    function () {

                        onComplite();

                    }
                );
            }
        );
    }

    function proxy(name) {

        var ip = getMyIp() || '';

        var param_ip =
            Lampa.Storage.field('online_mod_proxy_find_ip') === true
                ? 'ip' + ip + '/'
                : '';

        var proxy1 =
            new Date().getHours() % 2
                ? 'https://cors.nb557.workers.dev/'
                : 'https://cors.fx666.workers.dev/';

        var proxy2 =
            'https://apn-latest.onrender.com/';

        var proxy3 =
            'https://cors557.deno.dev/';

        var proxy_other =
            Lampa.Storage.field('online_mod_proxy_other') === true;

        var proxy_other_url =
            proxy_other
                ? Lampa.Storage.field('online_mod_proxy_other_url') + ''
                : '';

        var user_proxy1 =
            (proxy_other_url || proxy1) + param_ip;

        var user_proxy2 =
            (proxy_other_url || proxy2) + param_ip;

        var user_proxy3 =
            (proxy_other_url || proxy3) + param_ip;

        if (name === 'lumex_api')
            return user_proxy2;

        if (name === 'ip')
            return user_proxy3;

        return user_proxy1;
    }

    // 🇺🇦 UA Plugin state
    var UA_SOURCES = [];

    function registerSource(source) {

        UA_SOURCES.push(source);

    }

    function getSources() {

        return UA_SOURCES;

    }

    // EXPORT GLOBAL
    window.UA_DYVYS = {

        registerSource: registerSource,
        getSources: getSources,
        proxy: proxy,
        checkMyIp: checkMyIp,
        baseUserAgent: baseUserAgent

    };

})();

// 🇺🇦 ДИВИСЬ UA — REGISTER BLOCK
// BASED ON nb557 COMPONENT ENGINE

(function () {

    'use strict';

    function UAComponent(object) {

        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = new Lampa.Files(object);
        var html = $('<div class="online-prestige"></div>');
        var body = $('<div></div>');
        var loading = new Lampa.Loading({ info: '' });

        var sources = [];

        this.create = function () {

            this.activity.loader(true);

            this.activity.toggle();

            scroll.append(body);
            html.append(scroll.render());

            this.activity.append(html);

            this.start();

        };

        this.start = function () {

            this.activity.loader(true);

            var ua_sources = window.UA_DYVYS.getSources();

            if (!ua_sources.length) {

                this.activity.loader(false);

                body.append(
                    $('<div class="online-empty">Немає доступних джерел 🇺🇦</div>')
                );

                return;
            }

            this.loadSource(0);

        };

        this.loadSource = function (index) {

            var ua_sources = window.UA_DYVYS.getSources();

            if (index >= ua_sources.length) {

                this.activity.loader(false);

                return;
            }

            var source = ua_sources[index];

            try {

                source.search(object, null, null, this);

            }
            catch (e) {

                console.error('UA Source error:', e);

                this.loadSource(index + 1);

            }

        };

        this.append = function (items) {

            this.activity.loader(false);

            if (!items || !items.length)
                return;

            items.forEach(function (item) {

                var element = $('<div class="online-prestige__item selector"></div>');

                element.append(
                    $('<div class="online-prestige__title"></div>')
                        .text(item.title || 'UA Source')
                );

                element.on('hover:enter', function () {

                    Lampa.Player.play(item);

                });

                body.append(element);

            });

        };

        this.emptyForQuery = function () {

            this.activity.loader(false);

        };

        this.start = this.start.bind(this);

    }

    function initPlugin() {

        Lampa.Component.add('ua_dyvys', UAComponent);

        Lampa.Activity.push({

            title: '🇺🇦 Дивись UA',
            component: 'ua_dyvys',

            onBack: function () {

                Lampa.Activity.backward();

            }

        });

    }

    if (window.appready)
        initPlugin();
    else
        Lampa.Listener.follow('app', function (e) {

            if (e.type === 'ready')
                initPlugin();

        });

})();

// 🇺🇦 ДИВИСЬ UA — LUMEX SOURCE BLOCK
// ORIGINAL nb557 ENGINE (ADAPTED ONLY FOR REGISTER)

(function () {

    'use strict';

    function LumexSource() {

        var network = new Lampa.Reguest();

        var host = atob('aHR0cHM6Ly9wLmx1bWV4LnNwYWNl');
        var api = atob('aHR0cHM6Ly9hcGkubHVtZXguc3BhY2Uv');

        this.search = function (object, kinopoisk_id, data, component) {

            var title = object.search || object.movie.title;

            var url =
                window.UA_DYVYS.proxy('lumex_api') +
                api +
                'search?query=' +
                encodeURIComponent(title);

            network.clear();
            network.timeout(15000);

            network.native(

                url,

                function (json) {

                    if (!json || !json.results || !json.results.length) {

                        component.emptyForQuery(title);
                        return;
                    }

                    var movie = json.results[0];

                    if (!movie || !movie.id) {

                        component.emptyForQuery(title);
                        return;
                    }

                    loadStreams(movie.id, component);

                },

                function () {

                    component.emptyForQuery(title);

                }

            );

        };

        function loadStreams(id, component) {

            var url =
                window.UA_DYVYS.proxy('lumex_api') +
                api +
                'movie/' +
                id;

            network.clear();
            network.timeout(15000);

            network.native(

                url,

                function (json) {

                    if (!json || !json.streams) {

                        component.emptyForQuery('');
                        return;
                    }

                    var items = [];

                    json.streams.forEach(function (stream) {

                        if (!stream.url)
                            return;

                        items.push({

                            title: '🇺🇦 Lumex',
                            quality: stream.quality || 'HD',

                            url: stream.url,

                            stream: stream.url,

                            subtitles: stream.subtitles || [],

                            headers: {

                                'User-Agent': window.UA_DYVYS.baseUserAgent()

                            }

                        });

                    });

                    component.append(items);

                },

                function () {

                    component.emptyForQuery('');

                }

            );

        }

    }

    // REGISTER SOURCE
    window.UA_DYVYS.registerSource(

        new LumexSource()

    );

})();

// 🇺🇦 ДИВИСЬ UA — UASERIALS SOURCE BLOCK
// FULL nb557 STYLE INTEGRATION

(function () {

    'use strict';

    function UASerialsSource() {

        var network = new Lampa.Reguest();

        var host = 'https://uaserials.my/';
        var embedHost = 'https://hdvbua.pro/embed/';

        this.search = function (object, kinopoisk_id, data, component) {

            var title = object.search || object.movie.title;

            var url =
                host +
                'index.php?do=search&subaction=search&story=' +
                encodeURIComponent(title);

            network.clear();
            network.timeout(15000);

            network.native(

                url,

                function (html) {

                    if (!html) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var match =
                        html.match(/href="https:\/\/uaserials\.my\/(\d+)-[^"]+"/);

                    if (!match) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var id = match[1];

                    loadStream(id, component);

                },

                function () {

                    component.emptyForQuery(title);

                }

            );

        };

        function loadStream(id, component) {

            var streamUrl =
                embedHost + id;

            var items = [];

            items.push({

                title: '🇺🇦 UASerials',

                quality: 'HD',

                url: streamUrl,

                stream: streamUrl,

                headers: {

                    'User-Agent': window.UA_DYVYS.baseUserAgent(),
                    'Referer': host

                }

            });

            component.append(items);

        }

    }

    // REGISTER SOURCE
    window.UA_DYVYS.registerSource(

        new UASerialsSource()

    );

})();

// 🇺🇦 ДИВИСЬ UA — UAKINOGO SOURCE BLOCK
// nb557 ENGINE STYLE

(function () {

    'use strict';

    function UAKinogoSource() {

        var network = new Lampa.Reguest();

        var host = 'https://uakinogo.io/';

        this.search = function (object, kinopoisk_id, data, component) {

            var title = object.search || object.movie.title;

            var url =
                host +
                'search/' +
                encodeURIComponent(title);

            network.clear();
            network.timeout(15000);

            network.native(

                url,

                function (html) {

                    if (!html) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var match =
                        html.match(/href="https:\/\/uakinogo\.io\/[^"]+-\d+\.html"/);

                    if (!match) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var movieUrl =
                        match[0]
                        .replace('href="', '')
                        .replace('"', '');

                    loadMovie(movieUrl, component);

                },

                function () {

                    component.emptyForQuery(title);

                }

            );

        };

        function loadMovie(movieUrl, component) {

            network.clear();
            network.timeout(15000);

            network.native(

                movieUrl,

                function (html) {

                    if (!html) {

                        component.emptyForQuery('');
                        return;

                    }

                    var match =
                        html.match(/data-src="\/\/cinemar\.cc\/embed\/[^"]+"/);

                    if (!match) {

                        component.emptyForQuery('');
                        return;

                    }

                    var stream =
                        match[0]
                        .match(/\/\/cinemar\.cc\/embed\/[^"]+/)[0];

                    var items = [];

                    items.push({

                        title: '🇺🇦 UAKinogo',

                        quality: '1080p',

                        url: 'https:' + stream,

                        stream: 'https:' + stream,

                        headers: {

                            'User-Agent': window.UA_DYVYS.baseUserAgent(),
                            'Referer': host

                        }

                    });

                    component.append(items);

                },

                function () {

                    component.emptyForQuery('');

                }

            );

        }

    }

    // REGISTER SOURCE
    window.UA_DYVYS.registerSource(

        new UAKinogoSource()

    );

})();

// 🇺🇦 ДИВИСЬ UA — UAFLIX SOURCE BLOCK
// nb557 ENGINE STYLE — zetvideo integration

(function () {

    'use strict';

    function UAFlixSource() {

        var network = new Lampa.Reguest();

        var host = 'https://uafix.net/';

        this.search = function (object, kinopoisk_id, data, component) {

            var title = object.search || object.movie.title;

            var url =
                host +
                'index.php?do=search&subaction=search&story=' +
                encodeURIComponent(title);

            network.clear();
            network.timeout(15000);

            network.native(

                url,

                function (html) {

                    if (!html) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var match =
                        html.match(/href="https:\/\/uafix\.net\/[^"]+\//);

                    if (!match) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var movieUrl =
                        match[0]
                        .replace('href="', '')
                        .replace('"', '');

                    loadMovie(movieUrl, component);

                },

                function () {

                    component.emptyForQuery(title);

                }

            );

        };

        function loadMovie(movieUrl, component) {

            network.clear();
            network.timeout(15000);

            network.native(

                movieUrl,

                function (html) {

                    if (!html) {

                        component.emptyForQuery('');
                        return;

                    }

                    var match =
                        html.match(/iframe[^>]+src="https:\/\/zetvideo\.net\/vod\/[^"]+"/);

                    if (!match) {

                        component.emptyForQuery('');
                        return;

                    }

                    var stream =
                        match[0]
                        .match(/https:\/\/zetvideo\.net\/vod\/[^"]+/)[0];

                    var items = [];

                    items.push({

                        title: '🇺🇦 UAFLIX',

                        quality: '1080p',

                        url: stream,

                        stream: stream,

                        headers: {

                            'User-Agent': window.UA_DYVYS.baseUserAgent(),
                            'Referer': host

                        }

                    });

                    component.append(items);

                },

                function () {

                    component.emptyForQuery('');

                }

            );

        }

    }

    // REGISTER SOURCE
    window.UA_DYVYS.registerSource(

        new UAFlixSource()

    );

})();

// 🇺🇦 ДИВИСЬ UA — UAKINOBAY SOURCE BLOCK
// nb557 ENGINE STYLE — m7-club / ashdi integration

(function () {

    'use strict';

    function UAKinoBaySource() {

        var network = new Lampa.Reguest();

        var host = 'https://uakino-bay.net/';

        this.search = function (object, kinopoisk_id, data, component) {

            var title = object.search || object.movie.title;

            var url =
                host +
                'index.php?do=search&subaction=search&story=' +
                encodeURIComponent(title);

            network.clear();
            network.timeout(15000);

            network.native(

                url,

                function (html) {

                    if (!html) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var match =
                        html.match(/href="https:\/\/uakino-bay\.net\/\d+-[^"]+\.html"/);

                    if (!match) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var movieUrl =
                        match[0]
                        .replace('href="', '')
                        .replace('"', '');

                    loadMovie(movieUrl, component);

                },

                function () {

                    component.emptyForQuery(title);

                }

            );

        };

        function loadMovie(movieUrl, component) {

            network.clear();
            network.timeout(15000);

            network.native(

                movieUrl,

                function (html) {

                    if (!html) {

                        component.emptyForQuery('');
                        return;

                    }

                    var match =
                        html.match(/iframe[^>]+src="\/\/cdn\.m7-club\.com\/v\/[^"]+"/);

                    if (!match) {

                        component.emptyForQuery('');
                        return;

                    }

                    var stream =
                        match[0]
                        .match(/\/\/cdn\.m7-club\.com\/v\/[^"]+/)[0];

                    var streamUrl =
                        stream.startsWith('//')
                            ? 'https:' + stream
                            : stream;

                    var items = [];

                    items.push({

                        title: '🇺🇦 UAKinoBay',

                        quality: '1080p',

                        url: streamUrl,

                        stream: streamUrl,

                        headers: {

                            'User-Agent': window.UA_DYVYS.baseUserAgent(),
                            'Referer': host

                        }

                    });

                    component.append(items);

                },

                function () {

                    component.emptyForQuery('');

                }

            );

        }

    }

    // REGISTER SOURCE
    window.UA_DYVYS.registerSource(

        new UAKinoBaySource()

    );

})();

// 🇺🇦 ДИВИСЬ UA — KINOTOCHKA SOURCE BLOCK
// nb557 ENGINE STYLE — interkh / variyt integration

(function () {

    'use strict';

    function KinotochkaSource() {

        var network = new Lampa.Reguest();

        var host = 'https://kinotochka.biz/';

        this.search = function (object, kinopoisk_id, data, component) {

            var title = object.search || object.movie.title;

            var url =
                host +
                'index.php?do=search&subaction=search&story=' +
                encodeURIComponent(title);

            network.clear();
            network.timeout(15000);

            network.native(

                url,

                function (html) {

                    if (!html) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var match =
                        html.match(/href="https:\/\/kinotochka\.biz\/\d+-[^"]+\.html"/);

                    if (!match) {

                        component.emptyForQuery(title);
                        return;

                    }

                    var movieUrl =
                        match[0]
                        .replace('href="', '')
                        .replace('"', '');

                    loadMovie(movieUrl, component);

                },

                function () {

                    component.emptyForQuery(title);

                }

            );

        };

        function loadMovie(movieUrl, component) {

            network.clear();
            network.timeout(15000);

            network.native(

                movieUrl,

                function (html) {

                    if (!html) {

                        component.emptyForQuery('');
                        return;

                    }

                    var iframeMatch =
                        html.match(/iframe[^>]+src="https:\/\/[^"]+"/);

                    if (!iframeMatch) {

                        component.emptyForQuery('');
                        return;

                    }

                    var stream =
                        iframeMatch[0]
                        .match(/src="([^"]+)"/)[1];

                    var items = [];

                    items.push({

                        title: '🇺🇦 Kinotochka',

                        quality: '1080p',

                        url: stream,

                        stream: stream,

                        headers: {

                            'User-Agent': window.UA_DYVYS.baseUserAgent(),
                            'Referer': host

                        }

                    });

                    component.append(items);

                },

                function () {

                    component.emptyForQuery('');

                }

            );

        }

    }

    // REGISTER SOURCE
    window.UA_DYVYS.registerSource(

        new KinotochkaSource()

    );

})();

// 🇺🇦 ДИВИСЬ UA — FINAL PLAYER INTEGRATION
// FULL nb557 PLAYER COMPATIBILITY

(function () {

    'use strict';

    function normalizeItem(item) {

        if (!item)
            return null;

        var result = {

            title: item.title || '🇺🇦 Дивись UA',

            url: item.url || item.stream,

            stream: item.stream || item.url,

            quality: item.quality || 'HD',

            subtitles: item.subtitles || [],

            headers: item.headers || {

                'User-Agent': window.UA_DYVYS.baseUserAgent()

            }

        };

        return result;

    }

    function playItem(item) {

        var normalized = normalizeItem(item);

        if (!normalized)
            return;

        var url =
            normalized.stream;

        if (!url)
            return;

        var playerObject = {

            title: normalized.title,

            url: url,

            subtitles: normalized.subtitles,

            headers: normalized.headers

        };

        try {

            Lampa.Player.play(playerObject);

        }
        catch (e) {

            console.error('UA Player error:', e);

        }

    }

    // OVERRIDE append to ensure playback works exactly like nb557

    var originalAppend =
        Lampa.Component.prototype.append;

    if (originalAppend) {

        Lampa.Component.prototype.append =
            function (items) {

                var component = this;

                if (!items || !items.length)
                    return;

                items.forEach(function (item) {

                    var normalized =
                        normalizeItem(item);

                    if (!normalized)
                        return;

                    var element =
                        $('<div class="online-prestige__item selector"></div>');

                    element.append(
                        $('<div class="online-prestige__title"></div>')
                            .text(normalized.title)
                    );

                    element.append(
                        $('<div class="online-prestige__quality"></div>')
                            .text(normalized.quality)
                    );

                    element.on('hover:enter', function () {

                        playItem(normalized);

                    });

                    component.activity.find('.online-prestige').append(element);

                });

            };

    }

    console.log('🇺🇦 UA_DYVYS plugin fully loaded');

})();
