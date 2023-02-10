<?php

require_once('../codeImage.php');

if($yesOrNo===true){
if(!empty($_FILES['image']) && $_FILES['image']['error'] == 0) {
	
$uploaddir = 'image';	
	
$oldFile = $_POST['oldFile'];
if($oldFile!='undefined'){unlink($oldFile);}
	
//Set max file size in bytes is set to 5mb
$max_size = 3000000;
	
//Check that the file is not too big
if ($_FILES['image']['size'] > $max_size) {
die(json_encode(array("message"=>"File size is too large!", "code"=>2)));
}	
	
//Set default file extension whitelist
$whitelist_ext = array('png','jpg','JPEG');
//Set default file type whitelist
$whitelist_type = array('image/jpg','image/png','image/JPEG','image/jpeg');
// Get filename
$file_info = pathinfo($_FILES['image']['name']);
$name = $file_info['filename'];
$ext = $file_info['extension'];
$realName =$name.".".$ext;
	
//Check file has the right extension           
if (!in_array($ext, $whitelist_ext)) {
die(json_encode(array("message"=>"Invalid file extention!", "code"=>2)));	
}
//Check that the file is of the right type
if (!in_array($_FILES['image']["type"], $whitelist_type)) {
die(json_encode(array("message"=>"Invalid file Type!", "code"=>2)));	
}
	
/* Generates random filename and extension */
function tempnam_sfx($path, $suffix){
do {
$file = $path."/".time().mt_rand(1,10000).".".$suffix;
$fp = @fopen($file, 'x');
}
while(!$fp);

fclose($fp);
return $file;
}	
	
/* Process image with GD library */
$verifyimg = getimagesize($_FILES['image']['tmp_name']);

/* Rename both the image and the extension */
$uploadfile = tempnam_sfx($uploaddir, $ext);	
	
//Check if file already exists on server
if (file_exists($_FILES['image']['tmp_name'], $uploadfile)) {
die(json_encode(array("message"=>"Image upload failed! Please try again.", "code"=>2)));	
}	
	
/* Upload the file to a secure directory with the new name and extension */
if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadfile)) {
	
	$response = array("message"=>"Upload Success!", "code"=>1, "file"=>$uploadfile,"realName"=>$realName);
	echo json_encode($response);
	
}

}
else {
	$response = array("message"=>"Image upload failed!", "code"=>2);
	echo json_encode($response);

}}
else{
	$response = array("message"=>"Invalid Upload Key!", "code"=>2);
	echo json_encode($response);
}

?>