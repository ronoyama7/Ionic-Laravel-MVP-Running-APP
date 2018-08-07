<!-- Navigation-->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
    <!-- <a class="navbar-brand" href="/admin">Running Map | Admin</a> -->
    <img class="navbar-brand logo-image"  onclick="window.location.replace('/admin');" src = "/image/logo.svg"> </img>
    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="About Page">
                <a class="nav-link" href="/admin">
                    <i class="fa fa-fw fa-info-circle"></i>
                    <span class="nav-link-text"> O aplikaci </span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="OnBoard">
                <a class="nav-link" href="/admin/onboard">
                    <i class="fa fa-fw fa-info-circle"></i>
                    <span class="nav-link-text"> První spuštění </span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Track">
                <a class="nav-link" href="{{url('/admin/track')}}">
                    <i class="fa fa-fw fa-flag-checkered"></i>
                    <span class="nav-link-text"> Tratě </span>
                </a>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Place">
                <a class="nav-link" href="{{url('/admin/place')}}">
                    <i class="fa fa-fw fa-map-marker"></i>
                    <span class="nav-link-text"> Místa </span>
                </a>
            </li>
        </ul>
        <ul class="navbar-nav sidenav-toggler">
            <li class="nav-item">
                <a class="nav-link text-center" id="sidenavToggler">
                    <i class="fa fa-fw fa-angle-left"></i>
                </a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a class="nav-link" data-toggle="modal" data-target="#exampleModal">
                    <i class="fa fa-fw fa-sign-out"></i> Odhlásit se </a>
            </li>
        </ul>
    </div>
</nav>