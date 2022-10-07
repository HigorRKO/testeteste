// substitui todos os valores
function trocarTodos(strTextoTroca,strValorDe,strValorPadrao)
{	
	if(strValorPadrao == null)
		return "";
	while (strTextoTroca.indexOf(strValorDe)>=0)
	{
		strTextoTroca = strTextoTroca.replace(strValorDe,strValorPadrao);	
	}
	return strTextoTroca;
}

/**
* Metodo para converter um string para data
*
* @author Erix Henrique Morato <emorato@unibh.br>
* @param objDate - objeto contendo a data
* @since 16/08/2006
*/
function strToDate(strData)
{
	var objDate = new Date();
	var arrData = strData.split('/');
	var strMes = arrData[1];
	strMes0 = strMes.substring(0,1);
	strMes1 = strMes.substring(1);	
	if(strMes0=='0')
	{
		strMes = strMes1;
	}
	objDate.setFullYear(arrData[2],parseInt(strMes)-1,arrData[0]);
	objDate.setHours(0,0,0,0);
	return objDate;
}

/*
* Troca enter (\n) por br
*/
function trocarEnterPorBr(strValor)
{
		if(strValor==null)
			return "";
        strValor = strValor.replace(/\n/g, "<br />");
        return strValor;
}

function isExistsVar(strVar)
{
	var bolVar = ($("script:contains('"+strVar+"')").text()[0])==undefined?false:true;
	return bolVar;
}

function utf8_decode(str_data) {
  //  discuss at: http://phpjs.org/functions/utf8_decode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Norman "zEh" Fuchs
  // bugfixed by: hitwork
  // bugfixed by: Onno Marsman
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: kirilloid
  //   example 1: utf8_decode('Kevin van Zonneveld');
  //   returns 1: 'Kevin van Zonneveld'

  var tmp_arr = [],
    i = 0,
    ac = 0,
    c1 = 0,
    c2 = 0,
    c3 = 0,
    c4 = 0;

  str_data += '';

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 <= 191) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 <= 223) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else if (c1 <= 239) {
      // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      c4 = str_data.charCodeAt(i + 3);
      c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
      c1 -= 0x10000;
      tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
      tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
      i += 4;
    }
  }

  return tmp_arr.join('');
}