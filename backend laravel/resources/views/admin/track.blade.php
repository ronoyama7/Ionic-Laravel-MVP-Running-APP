@extends('layouts.app')

@section('content')

  <div class="content-wrapper">
    <div class="container-fluid">
      <!-- Breadcrumbs-->
      <ol class="breadcrumb">
        <li class="breadcrumb-item active"> Tratě </li>
      </ol>
      <div class="page-panel" style = "padding-left: 0px;padding-right: 0px;">
        <h4  style = "padding-left:15px;">  Tratě  </h4>
        <div class="table-responsive">
            <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>titul</th>
                  <th>Počáteční Adresu</th>
                  <th>Koncovou Adresu</th>
                  <th>Vzdálenost</th>
                  <th>Odhad</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <!-- <tfoot>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Office</th>
                  <th>Age</th>
                  <th>Start date</th>
                  <th>Salary</th>
                </tr>
              </tfoot> -->
              <tbody>
              <script>
                function track_edit(id) {
                  window.location.replace('/admin/track/edit/'+id);  
                }
              </script>
              <script>
                function track_delete(_id) {
                  let api_url = 'track/delete/';
                  $.ajax({
                  type: 'GET',
                  url: api_url,
                  data: {id: _id},
                  dataType: 'html',
                  success: function(data){
                    window.location.replace('/admin/track');  
                  }
                  });
                }
              </script>
              @foreach ($tracks as $track)
                <tr>
                <?php $trackData = json_decode($track->data, true); ?>
                  <td >{{$track->id}}</td>
                  <td >{{$trackData['title']}}</td>
                  <td >{{$trackData['start_address']}}</td>
                  <td>{{$trackData['end_address']}}</td>
                  <td>{{$trackData['distance']}}</td>
                  <td>{{$trackData['estimate']}}</td>
                  <td style="width:200px">
                  <button class="btn btn-primary" type="button" onclick="track_edit({{$track->id}})" >Upravit</button>
                  <button class="btn btn-danger" type="button" onclick="track_delete({{$track->id}})" >Odstranit</button>
                  </td>
                </tr>
              @endforeach
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="col-xl-12 col-sm-12">
        <script>
          function add_track() {
            window.location.replace('/admin/track/edit/new');  
          }
        </script>
        <button class="btn btn-primary float-right mb-5" type="button" onclick="add_track()" left >Přidat novou  tratě</button>
      </div>
    </div>
    <!-- /.container-fluid-->
    <!-- /.content-wrapper-->
    <footer class="sticky-footer">
      <div class="container">
        <div class="text-center">
          <input type="hidden" name="_token" id="csrf-token" value="{{ Session::token() }}" />
          <input type="hidden" name="_page" id="page-name" value="track" />
          <small>Běžecké mapy - Admin App by Pixelfield</small>
        </div>
      </div>
    </footer>
    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fa fa-angle-up"></i>
    </a>
    <!-- Logout Modal-->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Připraven odejít?</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">Zvolte "Odhlásit se", pokud jste připraveni ukončit svou aktuální relaci.</div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Zrušení</button>
            <a class="btn btn-primary" href="/logout"> Odhlásit se </a>
          </div>
        </div>
      </div>
    </div>
  </div>

@endsection