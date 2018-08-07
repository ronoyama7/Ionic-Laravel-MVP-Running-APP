@extends('layouts.app')

@section('content')
<meta name="init_value" content="{{ $tracks }}" >

  <div class="content-wrapper">
    <div class="container-fluid">
      <!-- Breadcrumbs-->
      <ol class="breadcrumb">
        <li class="breadcrumb-item active"> Upravte Tratě </li>
      </ol>
      <div class="col-xl-12 col-sm-12 mb-12 row">
        <div class="col-xl-4 col-sm-4 mb-4" style = "text-align:center;">
          <h6 class="edit-title"> Upravte Obrázek </h6>
          <img id="edit-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdZNAPuu3HDZHszJfgJHZdpNNMNuCPmvRE_fOUOKHj0ELQHRzG"
            style = "width: auto; height: auto; max-height: 435px; max-width: 100%;"/>
        </div>
        <div class="col-xl-8 col-sm-8 mb-8">
          <h6 class="edit-title"> Název trate </h6>
          <input id="edit-title" class= "mb-4" style = "height: 40px; width:100%" type="text" class="form-control input-sm"
            placeholder="Type your message here..."/>
          <h6 class="edit-title"> Příběh </h6>
          <input id="edit-description" class= "mb-4" style = "height: 40px; width:100%" type="text" class="form-control input-sm"
            placeholder="Type your message here..."/>
          <h6 class="edit-title"> Popis trate </h6>
          <textarea class="editor col-xl-12 col-sm-12 mb-12">
          </textarea>
        </div>
      </div>
      <div class="col-xl-12 col-sm-12 mb-12 row mt-4">
        <div class="col-xl-4 col-sm-4 mb-4" style = "text-align:center;">
        </div>
        <div class="col-xl-8 col-sm-8 mb-8 row"> 
          <div class="col-xl-3 col-sm-3 mb-3" style = "text-align:left;">
            <h6 class="edit-title"> Vyberte barvu </h6>
            <div id = "colorSelector" class="mt-4">
              <div style="
                  position: absolute;
                  top: 30px;
                  left: 15px;
                  width: 30px;
                  height: 30px;
                  background: url(/plugin/colorpicker/images/select.png) center">
              </div>
            </div>
          </div>
          <div class="col-xl-8 col-sm-8 mb-4" style = "text-align:left;">
            <h6 class="edit-title"> Přiblížení Mapy </h6>
            <div class="checkbox">
              <label>
                <input id ="bonus-toggl" checked  type="checkbox" data-toggle="toggle"  data-on="Povoleno" data-off="Zakázáno" >
              </label>
            </div>
          </div>
         
        </div>
      </div>
      <div class="col-xl-12 col-sm-12 mt-12 row"  style="padding-top:50px">
        <div class="col-xl-6 col-sm-6">
          <h6 class="edit-title"> Mapa </h6>
        </div>
        <div class="col-xl-6 col-sm-6 row">
          <div class="col-xl-6 col-sm-6">
            <h6 class="edit-title"> Bod na trase </h6>
          </div>
          <div class="col-xl-6 col-sm-6">
            <h6 class="edit-title"> Podrobnosti </h6>
          </div>
        </div>
      </div>
      <div class="col-xl-12 col-sm-12 mb-12 row">
        <div class="col-xl-6 col-sm-6 mb-6 ">
          <div id="map" style = "width: 100%; height: 500px; "></div>
        </div>
        <div class="col-xl-6 col-sm-6 mb-6  row" style = "padding-right: 0px;">
          <div class="col-xl-6 col-sm-6 mb-6" style = "max-height: 500px; overflow: auto; ">
            <div class="col-xl-12 col-sm-12 mb-6" style = "max-height: 435px; overflow: auto; padding: 0px;">
              <ol id = "WayPointDataTable" class='simple_with_animation vertical'>
              </ol>
            </div>
            <button id = "addWayPoint" class="btn btn-primary float-right mt-3" type="button" left >Přidat</button>
          </div>
          <div class="col-xl-6 col-sm-6 mb-6" style = "max-height: 500px; overflow: auto;">
          <!-- table-bordered -->
            <table class="table " width="100%" cellspacing="0"> 
              <thead>
                <tr>
                  <th>Návod</th>
                  <th>Vzdálenost</th>
                  <th>Odhad</th>
                </tr>
              </thead>
              <tbody id = "dataBody">
              </tbody>
            </table>
          </div>
        </div>  
      </div>
      <div class="col-xl-12 col-sm-12 mb-12 mt-4">
        <button id = "TrackEditSave" class="btn btn-primary float-right mt-3 mb-5" type="button" left >Uložit</button>
      </div>
  
        
    </div>
    <!-- /.container-fluid-->
    <!-- /.content-wrapper-->
    <footer class="sticky-footer">
      <div class="container">
        <div class="text-center">
          <input type="hidden" name="_token" id="csrf-token" value="{{ Session::token() }}" />
          <input type="hidden" name="_page" id="page-name" value="track-edit" />
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

    <!-- Upload Modal--> 
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" aria-hidden="true">
      <div class="modal-dialog" style="max-width:690px"  role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="uploadModalLabel">Nahrát obrázek</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
          <script src="{{url('js/dropzone.js')}}"></script>
          <link rel="stylesheet" href="{{url('css/dropzone.css')}}">
          <script>

            Dropzone.options.myDropzone = {
                paramName: 'file',
                maxFilesize: 2.5, // MB
                maxFiles: 1,
                paramName: 'file', 
                acceptedFiles: ".jpeg,.jpg,.png,.gif",
                addRemoveLinks: true,
                dictRemoveFile: 'Remove',
                dictFileTooBig: 'Image is bigger than 2.5MB',
                init: function() {
                    var myDropzone = this;
                    this.on("success", function(file, element) {
                      myDropzone.disable();
                      setTimeout(()=>{
                        myDropzone.enable();
                        myDropzone.removeAllFiles();

                        var file = {name: element.filename, size: element.file_size};
                        myDropzone.options.addedfile.call(myDropzone, file);
                        myDropzone.options.thumbnail.call(myDropzone, file, '/uploads/' + element.path);
                        file.path = "{{url('uploads/')}}" + "/" + element.path;
                        myDropzone.emit("complete", file);
                      },1200);
                      
                    });
                    this.on("complete", function(file) {
                      file.previewElement.addEventListener("click", function(){
                          window.setmdepicture(file);
                      });
                    });
                    jQuery.ajax({
                          type: 'POST',
                          url: "{{ url('/admin/image-get') }}",
                          data: { _token: $('#csrf-token').val()},
                          dataType: 'html',
                          success: function(data){
                              var rep = JSON.parse(data);
                              rep.forEach(function(element) {
                                var file = {name: element.filename, size: element.file_size};
                                myDropzone.options.addedfile.call(myDropzone, file);
                                myDropzone.options.thumbnail.call(myDropzone, file, '/uploads/' + element.path);
                                file.path = "{{url('uploads/')}}" + "/" + element.path;
                                myDropzone.emit("complete", file);
                              });
                          }
                    });
                    this.on("removedfile", function(file) {
                      jQuery.ajax({
                          type: 'POST',
                          url: "{{ url('/admin/image-remove') }}",
                          data: {id: file.name, _token: $('#csrf-token').val()},
                          dataType: 'html',
                          success: function(data){
                              var rep = JSON.parse(data);
                          }
                      });
                    } );
                }
            };
          </script>
          <form action="{{ url('/admin/image-upload') }}" enctype="multipart/form-data" class="dropzone" id="my-dropzone">
              {{ csrf_field() }}
          </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal">Hotovo</button>
          </div>
          <input type="hidden" name="_token" id="csrf-token" value="{{ Session::token() }}" />
          <input type="hidden" name="_page" id="page-name" value="onboard" />
          <input type="hidden" name="_page" id="picture_image" value="false" />
        </div>
      </div>
    </div>
  </div>

@endsection