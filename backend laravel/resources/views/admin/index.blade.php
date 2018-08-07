@extends('layouts.app')

@section('content')
</style>
  <div class="content-wrapper">
    <div class="container-fluid">
      <!-- Breadcrumbs-->
      <ol class="breadcrumb">
        <li class="breadcrumb-item active"> O aplikaci </li>
      </ol>
      <div class="page-panel">
        <h4> O aplikaci </h4>
        <textarea id="editor" class="editor col-xl-12 col-sm-12 mb-12">
        </textarea>
      </div>
        <button id = "AboutPageSave" class="btn btn-primary float-right mt-3 mb-3" type="button" left >Uložit</button>
    </div>
    <!-- /.container-fluid-->
    <!-- /.content-wrapper-->
    <footer class="sticky-footer">
      <div class="container">
        <div class="text-center">
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
                maxFiles: 20,
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
          <input type="hidden" name="_page" id="page-name" value="about" />
        </div>
      </div>
    </div>

  </div>

@endsection