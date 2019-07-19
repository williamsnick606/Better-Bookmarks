/*
 * file        : predictCategory.mjs
 * description : This file is an ES6 style module that contains
 *               code related to predicting a folder category
 *               that a newly created bookmark should go into
 *               by utlilizing machine learning techniques.
 * exports     : [ predictCategory/2 ]
 *
 */

/*
 * Description: This function predicts which category a bookmark belongs to given the website title and description.
 * Inputs: "title" == a string containing the title of the website,
 * 	   "description" == a string containing the description of the website.
 * Output: A number 0-4 corresponding to one of the 13 categories.
*/

function is_dumy(c){
    if(c=='.')return false;
    if(c=='!')return false;
    if(c==',')return false;
    if(c=='?')return false;
    if(c=='.')return false;
    if(c=='-')return false;
    if(c=='|')return false;
    return true;
}

function remove_dummy(a){
    var len = a.length;
    for(var i = 0; i < len; i++){
        if(is_dumy(a[i]))
            a[i] = ' ';
    }
    return a.toLowerCase();
}

function text_to_seq(text_token){
    var seq = [];
    text_token.forEach(function(word){
        if(dict.hasOwnProperty(word))
            seq.push(dict[word]);
    })
    return seq;
}

function pad_seq(seq){
    var len = seq.length;
    if(len >= 15){
        return [seq.slice(len-15, len)];
    }
    var ret = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(var i = 0; i<len; i++){
        ret[i] = seq[i];
    }
    return [ret];
}

export async function predictCategory(title, description){
    const model = await tf.loadLayersModel('model.json');
    var title_token = await remove_dummy(title).split(' ');
    var title_seq = await text_to_seq(title_token);
    var title_pad = await pad_seq(title_seq);
    var predict = await model.predict(tf.tensor2d(title_pad)).dataSync();
    var ret = -1;
    var max_value = -1;
    for(var i = 0; i < predict.length; i++){
        if(predict[i] > max_value){
            ret = i;
            max_value = predict[i];
        }
    }
    return ret;
}