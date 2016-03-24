(function ($) {
    "use strict";

    var modals = {
        __for__: {},
        __dat__: {},
        __cls__: {},
        __css__: {},
        __src__: {},
        __vis__: {},
        __if__: {},
        __tit__: {},
        __eid__: {},
        __pop__: {}
    };

    function getModalObject(modal, path, exist) {
        if (!modal[path]) {
            return exist ? undefined : modal[path] = {};
        }
        return modal[path];
    }

    $.fn.cBind = function (modal, flag) {
        $.each(this, function (i, el) {
            var path = el.getAttribute(flag);
            var currentObject, paths;

            el.removeAttribute(flag);
            if (!path) {
                return;
            }

            if (flag === '__for__') {
                if (!path || !/^.+ in .+$/.test(path)) {
                    return;
                }

                var forParts = path.split(' in ');

                var id = forParts[0];
                path = forParts[1];

                $.each($(el).find('*'), function (j, node) {
                    var nodePath = node.getAttribute('__for__');
                    if (nodePath) {
                        node.removeAttribute('__for__');
                        node.setAttribute('___for___', nodePath);
                    }

                    var setClauses = node.getAttribute('__set__');
                    if (setClauses) {
                        node.removeAttribute('__set__');
                        node.setAttribute('___set___', setClauses);
                    }
                });

                var obj = {
                    el: el,
                    children: $(el).children().clone(),
                    id: id
                };

                $(el).html('');

                currentObject = getModalObject(modal, path, false);

                currentObject.__els__ = currentObject.__els__ || [];
                currentObject.__els__.push(obj);

                return;
            }

            if (flag === '__pop__') {
                try {
                    paths = path = eval('(' + path + ')');
                } catch (e) {
                    return;
                }

                var tipIdPrefix = paths['prefix'];
                var tipId = paths['tipId'];

                if (!tipIdPrefix) {
                    return;
                }

                if (!tipId) {
                    return regPopup(el, {
                        popupId: '#' + tipIdPrefix
                    });
                }

                el.___pop___ = paths;

                currentObject = getModalObject(modal, tipId, false);
                currentObject.__els__ = currentObject.__els__ || [];
                if (currentObject.__els__.indexOf(el) < 0) {
                    currentObject.__els__.push(el);
                }

                return;
            }

            if (flag === '__cls__') {
                try {
                    paths = path = eval('(' + path + ')');
                } catch (e) {

                }
            }


            if (typeof path === 'string') {
                if (!path) {
                    return;
                }

                var reverse;
                if (path.indexOf('!') === 0) {
                    if (flag !== '__vis__') {
                        return;
                    }
                    reverse = true;
                    path = path.substr(1);
                }

                if (flag === '__dat__') {
                    if (el.tagName === 'SPAN' && !el.attributes.length) {
                        var newEl = document.createTextNode('');
                        $(el).replaceWith(newEl);
                        el = newEl;
                    }
                }

                currentObject = getModalObject(modal, path, false);

                if (!reverse) {
                    currentObject.__els__ = currentObject.__els__ || [];
                    if (currentObject.__els__.indexOf(el) < 0) {
                        currentObject.__els__.push(el);
                    }
                } else {
                    currentObject.__rev__ = currentObject.__rev__ || [];
                    if (currentObject.__rev__.indexOf(el) < 0) {
                        currentObject.__rev__.push(el);
                    }
                }

                if (flag === '__vis__' && !reverse) {
                    el.style.display = 'none';
                }
            } else {
                $.each(paths, function (cls, path) {
                    if ((path.indexOf('!') === 0)) {
                        path = path.substr(1);
                        $(el).addClass(cls);
                        cls = '-' + cls;
                    } else {
                        cls = '+' + cls;
                    }

                    currentObject = getModalObject(modal, path, false);
                    currentObject.__els__ = currentObject.__els__ || [];
                    el.___cls___ = el.___cls___ || {};
                    if (!el.___cls___[path]) {
                        el.___cls___[path] = [];
                    }
                    el.___cls___[path].push(cls);
                    if (currentObject.__els__.indexOf(el) < 0) {
                        currentObject.__els__.push(el);
                    }
                });
            }
        });

    };

    function regPopup(el, options) {
        $(el).mouseover(function () {
            var offset = $(this).offset();
            $(options.popupId).css({
                left: offset.left,
                top: offset.top + $(this).height(),
                minWidth: '100px',
                maxWidth: options.maxWidth
            }).show();
        });
        $(el).mouseleave(function () {
            $(options.popupId).hide();
        });
    }

    function getObjectLeaves(obj) {
        var leaves = [];

        for (var path in obj) {
            if ($.isPlainObject(obj[path])) {
                var subLeaves = getObjectLeaves(obj[path]);
                $.each(subLeaves, function (i, leaf) {
                    leaves.push({
                        path: path + '.' + leaf.path,
                        val: leaf.val
                    });
                });
            } else {
                leaves.push({
                    path: path,
                    val: obj[path]
                });
            }
        }

        return leaves;
    }

    $.cBindSet = function (path, val) {
        if ($.isPlainObject(path) && val === undefined) {
            var settings = getObjectLeaves(path);
            $.each(settings, function (i, setting) {
                $.cBindSet(setting.path, setting.val);
            });

            return;
        }

        $.each(modals, function (flag, modal) {
            var currentObject = getModalObject(modal, path, true);

            if (currentObject && (currentObject.__els__ || currentObject.__rev__) && currentObject.__val__ !== val) {
                switch (flag) {
                    case '__for__':
                        // should check if two arrays are equal __val__, val
                        // should collect and release garbage
                        // should reuse existing objects
                        // should set parent values
                        $.each(currentObject.__els__, function (i, o) {
                            $(o.el).html('');
                            if (!$.isArray(val)) {
                                return;
                            }
                            var l = val.length;
                            $.each(val, function (j, v) {
                                var c = $(o.children).clone();

                                $(o.el).append(c);

                                var newId = o.id + new Date().getTime() + '_' + l + '_' + j;

                                $.each($(o.el).find('*'), function (k, node) {
                                    var nodePath = node.getAttribute('___for___');
                                    if (nodePath) {
                                        node.removeAttribute('___for___');
                                        node.setAttribute('__for__', nodePath);
                                    }

                                    var setClauses = node.getAttribute('___set___');
                                    if (setClauses) {
                                        node.removeAttribute('___set___');
                                        node.setAttribute('__set__', setClauses.replace(new RegExp(o.id, 'g'), newId));
                                    }

                                    $.each(modals, function (flag, modal) {
                                        var flagAttr = node.getAttribute(flag);
                                        if (flagAttr) {
                                            if (~flagAttr.indexOf(o.id)) {
                                                flagAttr = flagAttr.replace(o.id, newId);
                                                node.setAttribute(flag, flagAttr);
                                            }

                                            if (/\$first|\$last|\$index/.test(flagAttr)) {
                                                flagAttr = flagAttr.replace(/^(!*)(\w*)(\$first|\$last|\$index)$/g, '$1' + newId + '_$3');
                                                node.setAttribute(flag, flagAttr);
                                            }

                                            if (~flagAttr.indexOf('$id')) {
                                                flagAttr = flagAttr.replace(/\w*\$id/g, newId + '_$id');
                                                node.setAttribute(flag, flagAttr);
                                            }

                                            if (~flagAttr.indexOf('$even')) {
                                                flagAttr = flagAttr.replace(/\w*\$even/g, newId + '_$even');
                                                node.setAttribute(flag, flagAttr);
                                            }

                                            if (~flagAttr.indexOf('$odd')) {
                                                flagAttr = flagAttr.replace(/\w*\$odd/g, newId + '_$odd');
                                                node.setAttribute(flag, flagAttr);
                                            }
                                        }
                                    });
                                });

                                $.cBind();

                                var data = {};
                                data[newId] = v;
                                data[newId + '_$id'] = newId;
                                data[newId + '_$first'] = j === 0;
                                data[newId + '_$last'] = j === l - 1;
                                data[newId + '_$index'] = j + 1;
                                data[newId + '_$even'] = !!(j % 2);
                                data[newId + '_$odd'] = !(j % 2);
                                $.cBindSet(data);
                            });
                        });
                        break;
                    case '__vis__':
                        var switchVisibility = function (collection, val) {
                            if (val) {
                                $(collection).show();
                                $.each(collection, function (i, el) {
                                    if (!el.getAttribute('style')) {
                                        el.removeAttribute('style');
                                    }
                                });
                            } else {
                                $(collection).hide();
                            }
                        };

                        switchVisibility(currentObject.__els__, val);
                        switchVisibility(currentObject.__rev__, !val);
                        break;
                    case '__dat__':
                        $.each(currentObject.__els__, function (i, el) {
                            if (el.nodeName === '#text') {
                                el.data = val;
                            } else {
                                el.innerHTML = val;
                            }
                        });
                        break;
                    case '__src__':
                        $(currentObject.__els__).attr('src', val);
                        break;
                    case '__cls__':
                        if (typeof val === 'number') {
                            val = !!val;
                        }
                        if (typeof val === 'boolean') {
                            $.each(currentObject.__els__, function (i, el) {
                                if (el.___cls___ && el.___cls___[path]) {
                                    $.each(el.___cls___[path], function (j, cls) {
                                        var v = (cls.substr(0, 1) === '-') ? !val : val;
                                        cls = cls.substr(1);

                                        if (v) {
                                            $(el).addClass(cls);
                                        } else {
                                            $(el).removeClass(cls);
                                        }
                                    });
                                }
                            });
                        }
                        if (typeof val === 'string') {
                            $.each(val.split(' '), function (i, cls) {
                                $(currentObject.__els__).addClass(cls);
                            });
                        } else if ($.isPlainObject(val)) {
                            $.each(val, function (cls, on) {
                                if (on) {
                                    $(currentObject.__els__).addClass(cls);
                                } else {
                                    $(currentObject.__els__).removeClass(cls);
                                }
                            });
                        } else if ($.isArray(val)) {
                            $.each(val, function (i, cls) {
                                $.cBindSet(currentObject, cls);
                            });
                        }
                        break;
                    case '__css__':
                        if (typeof val === 'string') {
                            var cssCol = val.split(';');
                            $.each(cssCol, function (i, css) {
                                var dat = css.split(':');
                                $(currentObject.__els__).css(dat[0], dat[1]);
                            });
                        } else if ($.isPlainObject(val)) {
                            $(currentObject.__els__).css(val);
                        } else if ($.isArray(val)) {
                            $.each(val, function (i, css) {
                                $.cBindSet(currentObject, css);
                            });
                        }
                        break;
                    case '__tit__':
                        $(currentObject.__els__).attr('title', val);
                        break;
                    case '__eid__':
                        $.each(currentObject.__els__, function (i, el) {
                            el.id += '_' + val;
                        });

                        break;
                    case '__pop__':
                        $.each(currentObject.__els__, function (i, el) {
                            return regPopup(el, {
                                popupId: '#' + el.___pop___['prefix'] + '_' + val,
                                maxWidth: el.___pop___['maxWidth'] + 'px'
                            });
                        });

                        break;
                    default:
                }

                currentObject.__val__ = val;
            }
        });
    };

    $.cBind = function () {
        $.each(modals, function (flag, modal) {
            $('[' + flag + ']').cBind(modal, flag);
        });

        $('[__set__]').each(function (i, el) {
            $.each(el.getAttribute('__set__').split('|'), function (i, eventStr) {
                var s_e = eventStr.split('@');
                var sets = s_e[0];
                var evnt = s_e[1] || 'click';

                if (sets) {
                    $(el).on(evnt, function (event) {
                        if (evnt === 'mouseover') {
                            $.cBindSet('$popup', 'left:' + event.clientX + 'px;$top:' + event.clientY + 'px;');
                        }

                        $.each(sets.split(';'), function (j, _set_) {
                            if (_set_) {
                                var setClause = _set_.split('=');
                                $.cBindSet(setClause[0], eval('(' + setClause[1] + ')'));
                            }
                        });
                    });
                }
            });
            el.removeAttribute('__set__');

        });
    };

    $($.cBind);
})(jQuery);