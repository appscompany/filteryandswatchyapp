(function () {

  /* Load Script function we may need to load jQuery from the Google's CDN */
  /* That code is world-reknown. */
  /* One source: http://snipplr.com/view/18756/loadscript/ */

  var loadScript = function (url, callback) {

    var script = document.createElement("script");
    script.type = "text/javascript";

    // If the browser is Internet Explorer.
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
      // For any other browser.
    } else {
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);

  };

  /* This is my app's JavaScript */
  var myAppJavaScript = function ($) {
    // $ in this scope references the jQuery object we'll use.
    // Don't use jQuery, or jQuery191, use the dollar sign.
    // Do this and do that, using $.

    var url = window.location.href;

    var nowtime = new Date();

    var domainname = window.location.hostname;
    var url = window.location.href;
    var originalurl = window.location.href.split('?')[0];
    var pathslist = originalurl.split('/');

    var laststring = pathslist[pathslist.length - 1];
    var productstring = pathslist[pathslist.length - 2];

    // Get parameter
    function getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Resize Images
    function resizeImage(imageurl, size) {
      imageurl = imageurl.split('?')[0];
      var imageextension = imageurl.split('.').pop();
      if (imageextension == 'jpg') {
        imageurl = imageurl.replace('.jpg', '_' + size + 'x' + size + '.jpg');
      }

      if (imageextension == 'jpeg') {
        imageurl = imageurl.replace('.jpeg', '_' + size + 'x' + size + '.jpeg');
      }
      if (imageextension == 'png') {
        imageurl = imageurl.replace('.png', '_' + size + 'x' + size + '.png');
      }
      var convertedimage = imageurl;
      return convertedimage;
    }

    // RGB to Hexa Conversion
    var rgbToHex = function (rgb) {
      var hex = Number(rgb).toString(16);
      if (hex.length < 2) {
        hex = "0" + hex;
      }
      return hex;
    };

    var fullColorHex = function (r, g, b) {
      var red = rgbToHex(r);
      var green = rgbToHex(g);
      var blue = rgbToHex(b);
      return red + green + blue;
    };

    (function ($) {

      if (!$) {
        throw Error('jquery-parallel-ajax: jQuery not found');
      }

      var defalutOption = {
        type: 'GET',
        cache: true
      };

      var reqAmount = 0;
      var resList = {
        length: 0
      };
      var timeoutTimer = null;
      var timeoutDefault = 3000;

      function reqCallBackSuccess(idx, res, successCallback) {
        resList[idx] = res;
        resList.length++;
        if (resList.length === reqAmount) {
          successCallback(resList);
          clearTimeout(timeoutTimer);
        }
      }

      function reqCallBackError(idx, err, errorCallback) {
        if (resList.length === -1) {
          return;
        }
        resList.length = -1;
        console.error('reqCallBackError', {
          index: idx,
          error: err
        });
        errorCallback(err);
        clearTimeout(timeoutTimer);
      }

      function parallelAjax(options, success, error, timeout) {
        var ajaxOptions = [];
        if (options instanceof Array) {
          ajaxOptions = options;
        }
        else {
          ajaxOptions.push(options);
        }
        // set ajax amount
        reqAmount = ajaxOptions.length;
        for (var i = 0; i < ajaxOptions.length; i++) {
          (function (arg) {
            // combine defalut option
            $.extend(ajaxOptions[i], defalutOption);
            // add success callback
            ajaxOptions[i].success = function (res) {
              reqCallBackSuccess(arg, res, success);
            }
            // add fail callback
            ajaxOptions[i].error = function (err) {
              reqCallBackError(arg, err, error);
            }
          })(i);
        }

        // do the reqests
        for (var i = 0; i < ajaxOptions.length; i++) {
          $.ajax(ajaxOptions[i]);
        }

        // set timeout
        timeoutTimer = setTimeout(function () {
          resList.length = -1;
          error({ msg: 'timeout' });
        }, timeout || timeoutDefault);
      }

      $.extend({
        'parallelAjax': parallelAjax
      })
    })($);
    
    function unique(list) {
      var result = [];
      $.each(list, function (i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
      });
      return result;
    }
    //return an array of objects according to key, value, or key and value matching
    function getObjects(obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
          objects = objects.concat(getObjects(obj[i], key, val));
        } else
          //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
          if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
          } else if (obj[i] == val && key == '') {
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1) {
              objects.push(obj);
            }
          }
      }
      return objects;
    }
    //return an array of values that match on a certain key
    function getValues(obj, key) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
          objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
          objects.push(obj[i]);
        }
      }
      return objects;
    }
    //return an array of keys that match on a certain value
    function getKeys(obj, val) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
          objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
          objects.push(i);
        }
      }
      return objects;
    }
    $(document).ready(function() {
      var _colornamesarray = "Color,Fabric Color";
      var _buttonnamesarray = "Size";
      var colornamesarray = _colornamesarray;
      var buttonnamesarray = _buttonnamesarray;
      if(productstring == 'collections')
      {
        
        var _productsGridSelector = document.querySelectorAll('.grid.grid--uniform.grid--view-items')[0];
        var _collectionspageatags = $(_productsGridSelector).find('a');
        var _collectionpageataghrefslist_ = [];

        for(var c=0; c<_collectionspageatags.length; c++)
        {
          var _ataghref = _collectionspageatags[c].href;
          if(_ataghref != "")
          {
            if(_ataghref.indexOf('products') != -1)
            {
              _collectionpageataghrefslist_.push(_ataghref);               
            }

          }
        }


        var _collectionpageataghrefslist = unique(_collectionpageataghrefslist_);
        
        var _parallelajaxArray = [];
        var _ca_product_urlsList_ = document.getElementById('__ca_product_urlsinput').value;
        var _ca_product_urlsList = _ca_product_urlsList_.split(',');
		var _producthandlesstring = '';
        for(var i=0; i<_collectionpageataghrefslist.length; i++)
        {
          var _hrefList = _collectionpageataghrefslist[i].split('/');
          var _producthandle = _hrefList[_hrefList.length - 1];
          if(_producthandlesstring == '')
          {
            _producthandlesstring = _producthandle;
          }
          else
          {
            _producthandlesstring = _producthandlesstring + ',' + _producthandle;
          }
          if(_collectionpageataghrefslist[i] != '')
          {
            _parallelajaxArray.push({url: _collectionpageataghrefslist[i] + '.json'});
          }

        }
        var _currenturl = window.location.href;
        var _collectionpagehrefurl = '';
        if(_currenturl.indexOf('?') != -1)
        {
          _collectionpagehrefurl = _currenturl + "&view=ca_swatch_c_template&note=" + _producthandlesstring;
        }
        else
        {
          _collectionpagehrefurl = _currenturl + "?view=ca_swatch_c_template&note=" + _producthandlesstring;
        }
        console.log(_collectionpagehrefurl);
        $.get(_collectionpagehrefurl, function(data) {

          console.log(data);
        });

        console.log(_parallelajaxArray);
        $.parallelAjax(_parallelajaxArray, function(response) {
          console.info('success', response);
          var _productsjson = response;

          var swatchtype = 'imageswatch';
          for(var p=0; p<_productsjson.length; p++)
          {
            var _productelement = _productsjson[p].product;
            var _productvariants = _productelement.variants;
            var _productimages = _productelement.images;
            var _collectionswatchdiv = '<div caf-data-template="collection" style="z-index: 50; display: inline-block; width: 100%; text-align: left;" id="caf_swatch_' +  _productelement.handle + '" class="caf_swatch_main_div" caf-handle="' +  _productelement.handle + '">' + 
                '</div>';
            var isColor = false;
            var _productoptions= _productelement.options;
            for(var o=0; o<_productoptions.length; o++)
            {
              var optionname = _productoptions[o].name;
              if(colornamesarray.indexOf(optionname) != -1)
              {
                isColor = true;
              }
              if(buttonnamesarray.indexOf(optionname) != -1)
              {
                isColor = false;
              }  
              //console.log(optionname + ',' + isColor);
              if(isColor == true)
              {

                var _collectionswatch_div = '';
                var _option_values = _productoptions[o].values;
                var _variantoptionschilddiv = '';
                for(var v=0; v<_option_values.length; v++)
                {
                  var _variant = [];
                  var _product_value = _option_values[v];

                  _variant = getObjects(_productvariants, 'option1', _product_value);

                  if(_variant.length == 0)
                  {
                    var _variant = getObjects(_productvariants, 'option2', _product_value);
                  }
                  if(_variant.length == 0)
                  {
                    var _variant = getObjects(_productvariants, 'option3', _product_value);
                  }

                  var _variantimageid = _variant[0].image_id;
                  //console.log(_variantimageid);
                  var _variantimageElement = getObjects(_productimages, 'id', _variantimageid);
                  var _variantimageSrc = '';
                  if(_variantimageElement.length > 0)
                  {
                    _variantimageSrc = _variantimageElement[0].src;
                  }
                  //console.log(_variantimageSrc);
                  var _colleciton_swatch_child_div = '<div data-tippy-content="' +  _product_value + '" data-tlite="s" title="' + _product_value + '" class="caf_swatch_childdiv caf-slider" caf-swatch-handle="' + _productelement.handle + '" caf-swatch-productid="' + _productelement.id + '" style="background-clip: content-box; padding: 2px; position:realtive; margin:2px; width: 50px; height: 50px; line-height: 50px; background-position: center; background-repeat: no-repeat; display: inline-block; border: 1px solid #F4F4F4; background-size: contain; border-radius: 50%; object-fit: contain; background-image:url(' +_variantimageSrc + ')" caf-swatchvalue="' + _product_value + '"></div>';
                  _collectionswatch_div = '<div caf-index="' +  _productoptions[o].position + '" style="text-align: left; display: inline-block; cursor: pointer;" caf-swatchtype="color" caf-optionname="' +  _productoptions[o].name + '" class="caf_swatch_div caf-slider-contain">' + 
                    _colleciton_swatch_child_div +'</div>';
                  _variantoptionschilddiv = _variantoptionschilddiv + _collectionswatch_div;
                }

                var _collectionswatchdiv = '<div caf-data-template="collection" style="z-index: 50; display: inline-block; width: 90%; text-align: center;" id="caf_swatch_' +  _productelement.handle + '" class="caf_swatch_main_div" caf-handle="' +  _productelement.handle + '">' + 
                    //'<div class="container">' +
                    //'<button class="slick-prev slick-arrow" aria-label="Previous" type="button" style="">Previous</button>' +
                    //'<button class="slick-next slick-arrow" aria-label="Next" type="button" style="">Next</button>' +
                    //'</div>' +
                    _variantoptionschilddiv + '</div>';
                //$('body').append(_collectionswatchdiv);
              }

            }
            var _product_handle = _productsjson[p].product.handle;

            for(var e=0; e<_collectionspageatags.length; e++)
            {
              var _atagHREF = _collectionspageatags[e].href;
              if(_atagHREF.indexOf(_product_handle) != -1)
              {
                var _parentElement = _collectionspageatags[e].parentElement;
                $(_parentElement).after(_collectionswatchdiv);
              }
            }
          }
          $('.caf_swatch_main_div').slick({
            infinite: false,
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            autoplay: false,
            draggable: false,
            responsive: true
          });
          /*$(".caf_swatch_main_div").lightSlider({
              controls:false,
              pager: false,
              autoWidth: true
            }); */
        }, function(error) {
          console.info('error', error);
        }, 25000);
      }
      
      if(productstring == 'products')
      {
        
        var _productvariants = JSON.parse(_variantsjson);
        var _productimages = JSON.parse(_productimagesjson);
        var _options1List = $("[caf-position-index=1]");
        var _optiontype = _options1List[0].getAttribute('ca_swatch_type');
        
        var _addtocartform = $('form[action="/cart/add"]')[0];
        var _swatchdiv_ = document.getElementById('ca_swatches_div');
        if(_addtocartform != null)
        {
          $(_addtocartform).before(_swatchdiv_);
          _swatchdiv_.style.display = 'block';
        }
        /*for(var t=0; t<_swatchdivs.length; t++)
        {
          if(_addtocartform != null)
          {
            $(_addtocartform).before(_swatchdivs);
          }
        }*/
        
        if(_optiontype == 'color')
        {
          
          for(var o1=0; o1<_options1List.length; o1++)
          {
            var _currentoptionElement = _options1List[o1].children[0];
            var _product_value = _currentoptionElement.getAttribute('caf-swatchvalue');

            var _variant = getObjects(_productvariants, 'option1', _product_value);
           /* var _variantimageid = _variant[0].image_id;
            
            var _variantimageElement = getObjects(_productimages, 'id', _variantimageid);
            var _variantimageSrc = '';
            if(_variantimageElement.length > 0)
            {
              _variantimageSrc = _variantimageElement[0].src;
            }
            if(_variantimageSrc == null)
            {
              //_variantimageSrc = _productelement.image.src;
            }*/
              _variantimageSrc = _variant[0].featured_image.src;
            _variantimageSrc = resizeImage(_variantimageSrc, 60);
            console.log(_variant);
            _currentoptionElement.style.backgroundImage = "url('" + _variantimageSrc + "')";
            
          }
        }
        
         /*_variant = getObjects(_productvariants, 'option1', _product_value);

                if(_variant.length == 0)
                {
                  var _variant = getObjects(_productvariants, 'option2', _product_value);
                }
                if(_variant.length == 0)
                {
                  var _variant = getObjects(_productvariants, 'option3', _product_value);
                }

                var _variantimageid = _variant[0].image_id;

                var _variantimageElement = getObjects(_productimages, 'id', _variantimageid);
                var _variantimageSrc = '';
                if(_variantimageElement.length > 0)
                {
                  _variantimageSrc = _variantimageElement[0].src;
                }
                if(_variantimageSrc == null)
                {
                  _variantimageSrc = _productelement.image.src;
                }
                _variantimageSrc = resizeImage(_variantimageSrc, 60);*/
        // Product Page
        var _addtocartform = $('form[action="/cart/add"]')[0];
        /*$.get("https://" + window.location.hostname + "/products/" + laststring + ".json", function(data, status){
          var _productsjson = data;
        
          var swatchtype = 'imageswatch';
          var _productelement = _productsjson.product;
          var _productvariants = _productelement.variants;
          var _productimages = _productelement.images;
         
          var isColor = false;
          var _productoptions= _productelement.options;
          for(var o=0; o<_productoptions.length; o++)
          {
            var optionname = _productoptions[o].name;
            if(colornamesarray.indexOf(optionname) != -1)
            {
              isColor = true;
            }
            if(buttonnamesarray.indexOf(optionname) != -1)
            {
              isColor = false;
            }  

            if(isColor == true)
            {

              var _collectionswatch_div = '';
              var _option_values = _productoptions[o].values;
              var _variantoptionschilddiv = '';
              for(var v=0; v<_option_values.length; v++)
              {
                var _variant = [];
                var _product_value = _option_values[v];

                _variant = getObjects(_productvariants, 'option1', _product_value);

                if(_variant.length == 0)
                {
                  var _variant = getObjects(_productvariants, 'option2', _product_value);
                }
                if(_variant.length == 0)
                {
                  var _variant = getObjects(_productvariants, 'option3', _product_value);
                }

                var _variantimageid = _variant[0].image_id;

                var _variantimageElement = getObjects(_productimages, 'id', _variantimageid);
                var _variantimageSrc = '';
                if(_variantimageElement.length > 0)
                {
                  _variantimageSrc = _variantimageElement[0].src;
                }
                if(_variantimageSrc == null)
                {
                  _variantimageSrc = _productelement.image.src;
                }
                _variantimageSrc = resizeImage(_variantimageSrc, 60);
                var _colleciton_swatch_child_div = '<div data-tippy-content="' +  _product_value + '" data-tlite="s" class="caf_swatch_p_childdiv caf_swatch_p_childdiv_tooltip caf-slider ca_tooltip" caf-swatch-handle="' + _productelement.handle + '" caf-swatch-productid="' + _productelement.id + '" style="margin-right: 10px; background-clip: content-box; padding: 2px; position:realtive; margin:2px; width: 50px; height: 50px; line-height: 50px; background-position: center; background-repeat: no-repeat; display: inline-block; border: 1px solid #F4F4F4; background-size: contain; border-radius: 50%; object-fit: contain; background-image:url(' +_variantimageSrc + ')" caf-swatchvalue="' + _product_value + '"><span class="ca_tooltiptext">' + _product_value + '</span></div>';
                _collectionswatch_div = '<div caf-index="' +  _productoptions[o].position + '" style="text-align: left; display: inline-block; cursor: pointer;" caf-swatchtype="color" caf-optionname="' +  _productoptions[o].name + '" class="caf_swatch_div caf-slider-contain">' + 
                  _colleciton_swatch_child_div +'</div>';
                _variantoptionschilddiv = _variantoptionschilddiv + _collectionswatch_div;
              }

              var _collectionswatchdiv = '<div caf-index="' + _productoptions[o].position + '" caf-data-template="collection" style="z-index: 50; display: inline-block; width: 100%; text-align: left;" id="caf_swatch_' +  _productelement.handle + '" class="caf_swatch_main_div" caf-handle="' +  _productelement.handle + '">' + 
                  '<label><b>' + optionname + '</b></label>' +
                  _variantoptionschilddiv + '</div>';
              //$('body').append(_collectionswatchdiv);
              $(_addtocartform).before(_collectionswatchdiv);
            }
            if(isColor == false)
            {
              var _collectionswatch_div = '';
              var _option_values = _productoptions[o].values;
              var _variantoptionschilddiv = '';
              for(var v=0; v<_option_values.length; v++)
              {
                var _variant = [];
                var _product_value = _option_values[v];
                if(_product_value != 'Default Title')
                {
                  var _colleciton_swatch_child_div = '<div ca_swatch_type="buttonswatch" caf-index="' +  _productoptions[o].position + '" caf-swatch-handle="' + _productelement.handle + '" caf-swatchvalue="' + _product_value + '" data-tlite="s" title="' +  _product_value + '" class="caf_swatch_p_childdiv caf-slider ca_button_swatch" style="background-color: ' + _buttonswatchbgcolor + ';font-weight: bold; margin-right: 10px; cursor: pointer; display: inline-block; text-align: center; border: 1px solid #' + _buttonswatchbordercolor + '; padding-left: 5%; padding-right: 5px;  height: 32px; line-height: 32px; vertical-align: middle;">' +  _product_value + '</div>';                    
                  _collectionswatch_div = '<div caf-index="' +  _productoptions[o].position + '" style="text-align: left; display: inline-block; cursor: pointer;" caf-swatchtype="color" caf-optionname="' +  _productoptions[o].name + '" class="caf_swatch_div caf-slider-contain">' + 
                    _colleciton_swatch_child_div +'</div>';
                  _variantoptionschilddiv = _variantoptionschilddiv + _collectionswatch_div;
                }
              }

              if(_option_values[0] != 'Default Title')
              {
                var _collectionswatchdiv = '<div caf-index="' +  _productoptions[o].position + '" caf-data-template="collection" style="z-index: 50; display: inline-block; width: 100%; text-align: left;" id="caf_swatch_' +  _productelement.handle + '" class="caf_swatch_main_div" caf-handle="' +  _productelement.handle + '">' + 
                    '<label><b>' + optionname + '</b></label>' +
                    _variantoptionschilddiv + '</div>';
                $(_addtocartform).before(_collectionswatchdiv);
              }
            }
          }
          
          


        });*/
      }
      var evObj = document.createEvent("Event");
      evObj.initEvent("change", true, true);
      $(document).on("mouseenter", ".caf_swatch_p_childdiv", function(e) {
        /*var currentSwatch = e.currentTarget;
          var _allcurrentSwatches = document.querySelectorAll('.caf_swatch_p_childdiv');
          for(var l=0; l<_allcurrentSwatches.length; l++)
          {
            _allcurrentSwatches[l].style.border = '1px solid #EAEAEA';
          }
          currentSwatch.style.border = '1px solid #000';*/
      });

      $(document).on("click", ".caf_swatch_p_childdiv", function(e) {
        var currentSwatch = e.currentTarget;
        var _allcurrentSwatches = document.querySelectorAll('.caf_swatch_p_childdiv');
        var _positionindex = currentSwatch.getAttribute('caf-index');
        var _allcurrentSwatches = document.querySelectorAll('.caf_swatch_p_childdiv');
        for(var l=0; l<_allcurrentSwatches.length; l++)
        {
          var _swatch_type = _allcurrentSwatches[l].getAttribute('ca_swatch_type');
          var _positionindex_ = _allcurrentSwatches[l].getAttribute('caf-index');
          console.log(_positionindex + ',' + _positionindex_);
          if(_positionindex == _positionindex_)
          {
            if(_swatch_type == 'buttonswatch')
            {
              _allcurrentSwatches[l].style.border = '1px solid #' + _buttonswatchbordercolor;
            }
            else
            {
              _allcurrentSwatches[l].style.border = '1px solid #F4F4F4';
            }
            
          }
        }
        currentSwatch.style.border = '1px solid #000';
        var _currentoptionvalue = currentSwatch.getAttribute('caf-swatchvalue');
        var currentSwatchParent = currentSwatch.parentElement;
        var _currentoptionindex= currentSwatchParent.getAttribute('caf-index');
        var _addtocartform = $('form[action="/cart/add"]')[0];
        if(_addtocartform != null)
        {
          var _selects = $(_addtocartform).find('SELECT');
          var correctselects = [];
          for(var s=0; s<_selects.length; s++)
          {
            var _selectname = _selects[s].name;
            if(_selectname != 'id')
            {
              correctselects.push(_selects[s]);
            }
          }
          var _correctoptionselect = correctselects[_currentoptionindex - 1];
          $(_correctoptionselect).val(_currentoptionvalue).trigger('change');
          _correctoptionselect.dispatchEvent(evObj);
          console.log(_correctoptionselect);
        }
      });
    });



  };

  /* If jQuery has not yet been loaded or if it has but it's too old for our needs,
          we will load jQuery from the Google CDN, and when it's fully loaded, we will run
          our app's JavaScript. Set your own limits here, the sample's code below uses 1.9.1
          as the minimum version we are ready to use, and if the jQuery is older, we load 1.9.1 */
  if ((typeof jQuery === 'undefined') || (parseInt(jQuery.fn.jquery) === 1 && parseFloat(jQuery.fn.jquery.replace(/^1\./, "")) < 9.1)) {
    loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function () {
      jQuery191 = jQuery.noConflict(true);
      myAppJavaScript(jQuery191);
    });
  } else {
    myAppJavaScript(jQuery);
  }

})();
