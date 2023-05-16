 

// Hàm gửi yêu cầu lấy danh sách sản phẩm từ API
function getProducts(searchValue) {
  apiGetProducts(searchValue)
    .then((response) => {
      // Call API thành công
      const products = response.data.map((product) => {
        return new Product(
          product.id,
          product.name,
          product.price,
          product.img,
          product.description
        );
      });

      renderProducts(products);
    })
    .catch((error) => {
      // Call API thất bại
      alert("API get products error");
    });
}

// Hàm thêm sản phẩm
function createProduct() {
  const product = {
    name: getElement("#TenSP").value,
    price: getElement("#GiaSP").value,
    img: getElement("#HinhSP").value,
    description: getElement("#loaiSP").value,
  };

  apiCreateProducts(product)
    .then((response) => {
      // Sau khi gọi API thêm sản phẩm thành công, dữ liệu chỉ mới thay đổi ở phía server
      // cần gọi lại API lấy danh sách sản phẩm (lúc này sẽ bao gồm sản phẩm vừa được thêm thành công) và hiển thị ra giao diện
      getProducts();
    })
    .catch((error) => {
      alert("Thêm sản phẩm thất bại");
    });
}

// Hàm xoá sản phẩm
function deleteProduct(productId) {
  apiDeleteProducts(productId)
    .then(() => {
      getProducts();
    })
    .catch(() => {
      alert("Xoá sản phẩm thất bại");
    });
}

function selectProduct(productId) {
  apiSelectProducts(productId)
    .then((response) => {
      const product = response.data;
      getElement("#TenSP").value = product.name;
      getElement("#HinhSP").value = product.img;
      getElement("#GiaSP").value = product.price;
      getElement("#loaiSP").value = product.description;

      // Mở và cập nhật giao diện cho modal
      getElement(".modal-title").innerHTML = "Cập nhật sản phẩm";
      getElement(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
        <button class="btn btn-primary" onclick="updateProduct('${product.id}')">Cập nhật</button>
      `;
      $("#myModal").modal("show");
    })
    .catch((error) => {
      // Tắt modal
      $("#myModal").modal("hide");
      alert("Lấy chi tiết sản phẩm thất bại");
    });
}

function updateProduct(productId) {
  const product = {
    name: getElement("#TenSP").value,
    price: getElement("#GiaSP").value,
    img: getElement("#HinhSP").value,
    description: getElement("#loaiSP").value,
  };
  apiUpdateProduct(productId, product)
    .then((response) => {
      getProducts();
      $("#myModal").modal("hide");
    })
    .catch((error) => {
      alert("cập nhật thất bại");
    });
}
// Hàm hiển thị danh sách sản phẩm ra table
function renderProducts(products) {
  let html = products.reduce((result, product, index) => {
    return (
      result +
      `
      <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>
          <img src="${product.img}" with="70" height="70" />
        </td>
        <td>${product.description}</td>
        <td>
        <button
        class="btn btn-primary" onclick="selectProduct('${
          product.id
        }')">Xem</button>
          <button class="btn btn-danger" onclick = "deleteProduct('${
            product.id
          }')">Xoá</button>
        </td>
      </tr>
    `
    );
  }, "");

  document.getElementById("tblDanhSachSP").innerHTML = html;
}

// ============ DOM ===============
getElement("#btnThemSP").addEventListener("click", () => {
  getElement(".modal-title").innerHTML = "Thêm sản phẩm";
  getElement(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    <button class="btn btn-primary" onclick="createProduct()">Thêm</button>
  `;
});

getElement("#txtSearch").addEventListener("keydown", (event) => {
  // event là 1 obj chứa thông tin về sự kiện được phát sinh
  // event.target: trả về cái ele phát sinh ra sự kiện

  if (event.key !== "Enter") return;

  const searchValue = event.target.value;
  getProducts(searchValue);
});

// ============ Helpers ==============
function getElement(selector) {
  return document.querySelector(selector);
}
