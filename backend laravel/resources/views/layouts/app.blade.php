<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Běžecké mapy Admin</title>
    <!-- Bootstrap core CSS-->
    <!-- <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"> -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <!-- Custom fonts for this template-->
    <link href="/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"> <!-- latest 5.0.13 june 2018, needs update -->
    <!-- Custom styles for this template-->
    <link href="/css/sb-admin.css" rel="stylesheet">
    <!-- Color Picker styles for this template-->
    <link href="/plugin/colorpicker/css/colorpicker.css" rel="stylesheet">
    <link href="/plugin/sortable-table/css/sortable.css" rel="stylesheet">
</head>

@isset($bodyclass)
    <body class="{{$bodyclass}}" id="page-top">
@endisset
@empty($bodyclass)
    <body class="fixed-nav sticky-footer bg-dark" id="page-top">
@endempty


@yield('content')

@empty($hidenav)
    @include('layouts.nav')
@endempty

<!-- Bootstrap core JavaScript-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>

<!-- Core plugin JavaScript-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.compatibility.js" integrity="sha256-MWsk0Zyox/iszpRSQk5a2iPLeWw0McNkGUAsHOyc/gE=" crossorigin="anonymous"></script>

<!-- Page level plugin JavaScript-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.js" integrity="sha256-JG6hsuMjFnQ2spWq0UiaDRJBaarzhFbUxiUTxQDA9Lk=" crossorigin="anonymous"></script>

<!-- Editor plugin Javascript -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
<script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>

<!-- Google Map plugin JavaScript -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCjR-A2avWzrWMOMWdwyO_8L7DGTwD4lrU&language=cs-CZ" 
		async defer></script>

<script src="/vendor/datatables/jquery.dataTables.js"></script>
<script src="/vendor/datatables/dataTables.bootstrap4.js"></script>

<!-- Custom scripts for all pages-->
<script src="/js/sb-admin.js"></script>

<!-- Custom scripts for this page-->
<script src="/js/sb-admin-datatables.js"></script>
<script src="/js/sb-admin-logic.js"></script>
<!-- <script src="/js/sb-admin-charts.js"></script> -->

<script src="/plugin/colorpicker/js/colorpicker.js"></script>
<script src="/plugin/sortable-table/js/sortable.js"></script>


<!-- Custom script for toggl -->

<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
</body>
</html>